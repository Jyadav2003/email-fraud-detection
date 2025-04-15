# backend/app/services/email_processor.py
import re
import spacy
from bs4 import BeautifulSoup
from email.parser import BytesParser
from email.policy import default
from urllib.parse import urlparse

class EmailProcessor:
    def __init__(self):
        # Load NLP model
        self.nlp = spacy.load("en_core_web_sm")
        
        # Common fraud keywords
        self.fraud_keywords = [
            "urgent", "verify", "suspend", "account", "login", "click", "bank", 
            "update", "confirm", "password", "security", "alert", "unauthorized",
            "payment", "expires", "immediately", "verify", "information"
        ]
        
        # Known phishing domains
        self.suspicious_domains = [
            "securityupdate", "verification", "login-verify", "account-update",
            "secure-login", "customer-support", "billing-update"
        ]
    
    def parse_email(self, raw_email):
        """Parse raw email content and extract components"""
        parser = BytesParser(policy=default)
        parsed_email = parser.parsebytes(raw_email)
        
        # Extract basic headers
        headers = {
            "from": parsed_email.get("From", ""),
            "to": parsed_email.get("To", ""),
            "subject": parsed_email.get("Subject", ""),
            "date": parsed_email.get("Date", ""),
            "message_id": parsed_email.get("Message-ID", "")
        }
        
        # Get email body
        body = ""
        if parsed_email.is_multipart():
            for part in parsed_email.iter_parts():
                content_type = part.get_content_type()
                if content_type == "text/plain" or content_type == "text/html":
                    body += part.get_content()
        else:
            body = parsed_email.get_content()
            
        # Extract links from HTML content
        links = []
        if "<html" in body:
            soup = BeautifulSoup(body, "html.parser")
            for a_tag in soup.find_all('a', href=True):
                links.append(a_tag['href'])
                
        return {
            "headers": headers,
            "body": body,
            "links": links
        }
    
    def extract_features(self, parsed_email):
        """Extract features for fraud detection from parsed email"""
        features = {}
        
        # Header analysis
        headers = parsed_email["headers"]
        features["from_domain"] = self._extract_domain(headers.get("from", ""))
        
        # Content analysis
        body = parsed_email["body"]
        features["body_length"] = len(body)
        features["contains_html"] = "<html" in body.lower()
        
        # Keyword analysis
        body_text = BeautifulSoup(body, "html.parser").get_text() if features["contains_html"] else body
        features["fraud_keyword_count"] = sum(1 for keyword in self.fraud_keywords if keyword.lower() in body_text.lower())
        features["fraud_keyword_ratio"] = features["fraud_keyword_count"] / len(body_text.split()) if body_text else 0
        
        # Link analysis
        links = parsed_email["links"]
        features["link_count"] = len(links)
        features["suspicious_links"] = self._analyze_links(links)
        features["suspicious_link_ratio"] = features["suspicious_links"] / features["link_count"] if features["link_count"] > 0 else 0
        
        # Urgency detection
        features["urgency_score"] = self._detect_urgency(body_text)
        
        # Grammar/spelling quality - simplified version
        features["grammar_mistakes"] = self._count_grammar_issues(body_text)
        
        return features
    
    def _extract_domain(self, email_address):
        """Extract domain from email address"""
        match = re.search(r'@([^@]+)$', email_address)
        return match.group(1) if match else ""
    
    def _analyze_links(self, links):
        """Analyze links for suspicious patterns"""
        suspicious_count = 0
        
        for link in links:
            parsed_url = urlparse(link)
            domain = parsed_url.netloc
            
            # Check for IP addresses instead of domains
            if re.match(r'^\d+\.\d+\.\d+\.\d+$', domain):
                suspicious_count += 1
                continue
                
            # Check for suspicious domains
            for suspicious in self.suspicious_domains:
                if suspicious in domain:
                    suspicious_count += 1
                    break
                    
            # Check for URL shorteners
            short_url_services = ["bit.ly", "tinyurl", "goo.gl", "t.co", "is.gd"]
            if any(service in domain for service in short_url_services):
                suspicious_count += 1
                
            # Check for mismatched text and URL in HTML
            # (simplified - would need the full HTML context for better analysis)
                
        return suspicious_count
    
    def _detect_urgency(self, text):
        """Detect urgent language patterns"""
        urgency_phrases = [
            "act now", "immediate action", "urgent", "expires soon",
            "limited time", "immediately", "as soon as possible",
            "deadline", "warning", "alert", "time sensitive"
        ]
        
        score = sum(1 for phrase in urgency_phrases if phrase in text.lower())
        return score
    
    def _count_grammar_issues(self, text):
        """Simple method to count potential grammar issues"""
        # This is simplified - a real implementation would use a grammar checking library
        doc = self.nlp(text)
        
        # Count multiple consecutive punctuation as a sign of poor quality
        multiple_punct = len(re.findall(r'[!?]{2,}', text))
        
        # Count all-caps words as potential issues
        all_caps = sum(1 for token in doc if token.is_alpha and token.text.isupper() and len(token.text) > 1)
        
        return multiple_punct + all_caps

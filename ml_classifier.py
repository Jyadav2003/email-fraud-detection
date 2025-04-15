# backend/app/services/ml_classifier.py
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from .email_processor import EmailProcessor

class FraudClassifier:
    def __init__(self, model_path=None):
        self.processor = EmailProcessor()
        
        # Load pre-trained model if available
        if model_path:
            try:
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
            except:
                # If model loading fails, create a new one
                self.model = self._create_model()
        else:
            # Create a new model
            self.model = self._create_model()
            
        # Feature list for the model
        self.features = [
            'body_length', 'contains_html', 'fraud_keyword_count', 
            'fraud_keyword_ratio', 'link_count', 'suspicious_links',
            'suspicious_link_ratio', 'urgency_score', 'grammar_mistakes'
        ]
            
    def _create_model(self):
        """Create a new fraud detection model"""
        # In a real implementation, you would train this on historical data
        # For now, we'll initialize with default parameters
        return RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
    
    def predict(self, parsed_email):
        """Predict fraud probability for an email"""
        # Extract features
        features = self.processor.extract_features(parsed_email)
        
        # Convert to feature vector
        feature_vector = np.array([[
            features['body_length'],
            1 if features['contains_html'] else 0,
            features['fraud_keyword_count'],
            features['fraud_keyword_ratio'],
            features['link_count'],
            features['suspicious_links'],
            features['suspicious_link_ratio'],
            features['urgency_score'],
            features['grammar_mistakes']
        ]])
        
        # Make prediction
        fraud_probability = self.model.predict_proba(feature_vector)[0, 1]
        
        # Generate explanation for indicators
        indicators = self._generate_indicators(features, fraud_probability)
        
        return {
            'fraud_probability': float(fraud_probability),
            'is_fraud': fraud_probability > 0.7,  # Threshold can be adjusted
            'indicators': indicators
        }
    
    def _generate_indicators(self, features, fraud_probability):
        """Generate human-readable fraud indicators"""
        indicators = []
        
        # High number of suspicious links
        if features['suspicious_link_ratio'] > 0.5 and features['link_count'] > 0:
            indicators.append({
                'type': 'suspicious_links',
                'description': f"Contains suspicious links ({features['suspicious_links']} out of {features['link_count']})",
                'severity': min(10, int(features['suspicious_link_ratio'] * 10) + 5)
            })
            
        # High urgency language
        if features['urgency_score'] > 2:
            indicators.append({
                'type': 'urgency_language',
                'description': f"Contains urgent or time-sensitive language (score: {features['urgency_score']})",
                'severity': min(8, features['urgency_score'] * 2)
            })
            
        # Suspicious keywords
        if features['fraud_keyword_ratio'] > 0.05:
            indicators.append({
                'type': 'suspicious_keywords',
                'description': f"Contains suspicious keywords ({features['fraud_keyword_count']} instances)",
                'severity': min(7, int(features['fraud_keyword_ratio'] * 100))
            })
            
        # Poor grammar/spelling quality
        if features['grammar_mistakes'] > 5:
            indicators.append({
                'type': 'poor_quality',
                'description': f"Contains grammatical issues or unusual formatting",
                'severity': min(6, features['grammar_mistakes'] // 2)
            })
            
        return indicators
    
    def update_model(self, email_data, is_fraud):
        """Update model with new labeled data (for feedback loop)"""
        # This would be expanded in a real implementation
        # Simplified version for demonstration purposes
        features = self.processor.extract_features(email_data)
        
        # Extract feature vector
        X = np.array([[
            features['body_length'],
            1 if features['contains_html'] else 0,
            features['fraud_keyword_count'],
            features['fraud_keyword_ratio'],
            features['link_count'],
            features['suspicious_links'],
            features['suspicious_link_ratio'],
            features['urgency_score'],
            features['grammar_mistakes']
        ]])
        
        y = np.array([1 if is_fraud else 0])
        
        # Partial fit (in real implementation, you'd accumulate data and retrain)
        self.model.fit(X, y)
        
    def save_model(self, model_path):
        """Save the current model to disk"""
        with open(model_path, 'wb') as f:
            pickle.dump(self.model, f)

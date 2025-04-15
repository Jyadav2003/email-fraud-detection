// src/components/EmailAnalysis/EmailScanner.js
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Divider,
  Grid,
  Tab,
  Tabs
} from '@mui/material';
import { Email as EmailIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { emailApi } from '../../services/api';
import AlertBanner from '../common/AlertBanner';
import LoadingSpinner from '../common/LoadingSpinner';
import SecurityTips from '../common/SecurityTips';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`email-tabpanel-${index}`}
      aria-labelledby={`email-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EmailScanner = ({ onAnalysisComplete }) => {
  const [tabValue, setTabValue] = useState(0);
  const [emailText, setEmailText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'message/rfc822': ['.eml'],
      'text/plain': ['.txt'],
      'application/octet-stream': []
    },
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    }
  });
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const analyzeText = async () => {
    if (!emailText.trim()) {
      setAlert({
        open: true,
        message: 'Please enter email content to analyze',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await emailApi.analyzeEmailText(emailText);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error('Error analyzing email:', error);
      setAlert({
        open: true,
        message: 'Failed to analyze email. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const uploadFile = async () => {
    if (!file) {
      setAlert({
        open: true,
        message: 'Please select a file to analyze',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await emailApi.uploadEmailFile(file);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error('Error uploading email file:', error);
      setAlert({
        open: true,
        message: 'Failed to upload email file. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        <EmailIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Email Fraud Scanner
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <AlertBanner 
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="email analysis tabs">
          <Tab label="Paste Email Text" id="email-tab-0" />
          <Tab label="Upload Email File" id="email-tab-1" />
        </Tabs>
      </Box>
      
      {loading ? (
        <LoadingSpinner message="Analyzing email..." />
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            <TextField
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              placeholder="Paste the email content here..."
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={analyzeText}
              disabled={!emailText.trim()}
            >
              Analyze Email
            </Button>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Box 
              {...getRootProps()} 
              sx={{ 
                border: '2px dashed #cccccc',
                borderRadius: 2,
                p: 4,
                mb: 3,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? '#f0f7ff' : '#f9f9f9',
                '&:hover': {
                  backgroundColor: '#f0f7ff'
                }
              }}
            >
              <input {...getInputProps()} />
              <UploadIcon sx={{ fontSize: 48, color: '#3f51b5', mb: 2 }} />
              {file ? (
                <Typography variant="body1">
                  Selected file: <strong>{file.name}</strong>
                </Typography>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Drag & drop an email file here
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Or click to select a file (.eml or .txt)
                  </Typography>
                </>
              )}
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={uploadFile}
              disabled={!file}
            >
              Analyze Email File
            </Button>
          </TabPanel>
        </>
      )}
      
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <SecurityTips />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EmailScanner;
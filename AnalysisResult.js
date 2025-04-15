// src/components/EmailAnalysis/AnalysisResult.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  ThumbUp,
  ThumbDown
} from '@mui/icons-material';
import IndicatorsList from './IndicatorsList';
import { emailApi } from '../../services/api';
import AlertBanner from '../common/AlertBanner';

const AnalysisResult = ({ result, onReset }) => {
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!result) return null;
  
  const { fraud_probability: fraudProbability, is_fraud: isFraud, indicators } = result.analysis || result;
  const riskLevel = fraudProbability < 0.3 ? 'low' : fraudProbability < 0.7 ? 'medium' : 'high';
  
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low':
        return '#4caf50'; // green
      case 'medium':
        return '#ff9800'; // orange
      case 'high':
        return '#f44336'; // red
      default:
        return '#3f51b5'; // blue
    }
  };
  
  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle sx={{ fontSize: 60, color: '#4caf50' }} />;
      case 'medium':
        return <Warning sx={{ fontSize: 60, color: '#ff9800' }} />;
      case 'high':
        return <ErrorIcon sx={{ fontSize: 60, color: '#f44336' }} />;
      default:
        return null;
    }
  };
  
  const handleFeedback = async (isFraudulent) => {
    if (!result.id) {
      setAlert({
        open: true, 
        message: 'Cannot provide feedback for this analysis.',
        severity: 'warning'
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await emailApi.provideFeedback(result.id, isFraudulent);
      setFeedbackSubmitted(true);
      setAlert({
        open: true, 
        message: 'Thank you for your feedback!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setAlert({
        open: true, 
        message: 'Failed to submit feedback. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Fade in={true}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <AlertBanner 
          open={alert.open}
          message={alert.message}
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
        />
        
        <Typography variant="h5" gutterBottom>
          Analysis Results
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {/* Summary Card */}
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: `2px solid ${getRiskColor()}`,
                boxShadow: `0 4px 12px rgba(0,0,0,0.1)`
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {getRiskIcon()}
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {riskLevel === 'low' ? 'Low Risk' : riskLevel === 'medium' ? 'Medium Risk' : 'High Risk'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {riskLevel === 'low' 
                    ? 'This email appears to be legitimate.' 
                    : riskLevel === 'medium' 
                      ? 'This email has some suspicious elements.' 
                      : 'This email is likely fraudulent.'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={fraudProbability * 100}
                    size={80}
                    thickness={5}
                    sx={{
                      color: getRiskColor(),
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                      },
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                      position: 'absolute',
                      fontWeight: 'bold'
                    }}
                  >
                    {Math.round(fraudProbability * 100)}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Fraud Probability Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Indicators List */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Detected Risk Indicators
            </Typography>
            <IndicatorsList indicators={indicators} />
            
            {/* Feedback Section */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Was this analysis accurate?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<ThumbUp />}
                  disabled={feedbackSubmitted || isSubmitting}
                  onClick={() => handleFeedback(isFraud)}
                >
                  {isSubmitting ? 'Submitting...' : 'Yes, Accurate'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ThumbDown />}
                  disabled={feedbackSubmitted || isSubmitting}
                  onClick={() => handleFeedback(!isFraud)}
                >
                  {isSubmitting ? 'Submitting...' : 'No, Inaccurate'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={onReset}
          >
            Analyze Another Email
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
};

export default AnalysisResult;
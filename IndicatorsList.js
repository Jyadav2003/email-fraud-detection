// src/components/EmailAnalysis/IndicatorsList.js
import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  LinkOff,
  Warning,
  PriorityHigh,
  TextFormat,
  Error as ErrorIcon
} from '@mui/icons-material';

const IndicatorsList = ({ indicators = [] }) => {
  if (!indicators || indicators.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body1" color="textSecondary">
          No fraud indicators detected.
        </Typography>
      </Box>
    );
  }

  // Get appropriate icon based on indicator type
  const getIndicatorIcon = (type) => {
    switch (type) {
      case 'suspicious_links':
        return <LinkOff color="error" />;
      case 'urgency_language':
        return <PriorityHigh color="error" />;
      case 'suspicious_keywords':
        return <Warning color="error" />;
      case 'poor_quality':
        return <TextFormat color="error" />;
      default:
        return <ErrorIcon color="error" />;
    }
  };

  // Get color based on severity
  const getSeverityColor = (severity) => {
    if (severity >= 8) return '#f44336'; // Red
    if (severity >= 5) return '#ff9800'; // Orange
    return '#4caf50'; // Green
  };

  // Get label based on severity
  const getSeverityLabel = (severity) => {
    if (severity >= 8) return 'High Risk';
    if (severity >= 5) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {indicators.map((indicator, index) => (
        <ListItem
          key={index}
          alignItems="flex-start"
          sx={{
            mb: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 2
          }}
        >
          <ListItemIcon>
            {getIndicatorIcon(indicator.type)}
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                  {indicator.description}
                </Typography>
                <Chip 
                  label={getSeverityLabel(indicator.severity)} 
                  size="small"
                  sx={{ 
                    backgroundColor: getSeverityColor(indicator.severity),
                    color: 'white'
                  }} 
                />
              </Box>
            }
            secondary={
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1, minWidth: '70px' }}>
                    Severity:
                  </Typography>
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress
                      variant="determinate"
                      value={(indicator.severity / 10) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getSeverityColor(indicator.severity)
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {indicator.severity}/10
                  </Typography>
                </Box>
                {indicator.evidence && (
                  <Typography variant="body2" color="text.secondary">
                    Evidence: {indicator.evidence}
                  </Typography>
                )}
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default IndicatorsList;
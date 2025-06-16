import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchVisitorProfile } from '../services/visitorService';
import { Card, CardContent, Typography, Grid, Avatar, Box, CircularProgress, Alert } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';

const VisitorsProfile = () => {
  const { id } = useParams();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVisitorProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchVisitorProfile(id);
        setVisitor(data);
        setError(null);
      } catch (err) {
        console.error('Error loading visitor profile:', err);
        setError('Failed to load visitor profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadVisitorProfile();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!visitor) {
    return (
      <Box p={3}>
        <Alert severity="info">Visitor not found</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  src={visitor.picture_url}
                  alt={visitor.name}
                  sx={{ width: 100, height: 100 }}
                />
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {visitor.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {visitor.email}
                  </Typography>
                  <Typography color="textSecondary">
                    {visitor.phone}
                  </Typography>
                  {visitor.address && (
                    <Typography color="textSecondary">
                      {visitor.address}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Visit Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Visit Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Monthly Visits
                  </Typography>
                  <Typography variant="h6">
                    {visitor.monthlyVisits}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Yearly Visits
                  </Typography>
                  <Typography variant="h6">
                    {visitor.yearlyVisits}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Visits
                  </Typography>
                  <Typography variant="h6">
                    {visitor.lifeVisits}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Avg. Time/Visit (Year)
                  </Typography>
                  <Typography variant="h6">
                    {visitor.avgTimePerVisitYear || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Stores Visited (Month)
                  </Typography>
                  <Typography variant="h6">
                    {visitor.storesVisitedMonth}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Stores Visited (Total)
                  </Typography>
                  <Typography variant="h6">
                    {visitor.storesVisitedLife}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Visit Timeline */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Visits
              </Typography>
              <Timeline>
                {visitor.visits.slice(0, 5).map((visit, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      {index < visitor.visits.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">
                        {visit.date}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Entry: {visit.timeEntry} | Exit: {visit.timeExit}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Stores: {visit.storesVisited} | Time: {visit.timeSpent}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>

        {/* Interests */}
        {visitor.interests && visitor.interests.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Interests
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {visitor.interests.map((interest, index) => (
                    <Box
                      key={index}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {interest}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default VisitorsProfile; 
import React, { useState, useEffect, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { toast } from 'react-toastify';
import { env } from 'src/config/env.config';

interface UserKYCReviewProps {
  userId: string;
  sumsubId: string;
  sumsubStatus: string | null | undefined;
  onClose: () => void;
  onStatusUpdate: (status: 'approved' | 'rejected', reason?: string) => void;
  token: string;
  userData?: {
    username: string;
    fullname: string;
    email: string;
    phone_number: string;
    country: string;
    city: string;
  };
}

interface Document {
  id: string;
  type: string;
  side: string;
  status: string;
  createdAt: string;
}

export function UserKYCReview({
  userId,
  sumsubId,
  sumsubStatus,
  onClose,
  onStatusUpdate,
  token,
  userData,
}: UserKYCReviewProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${env.api.baseUrl}:${env.api.port}/api/sumsub/documents/${sumsubId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      console.log('Documents data:', data);
      if (data.success && data.data && Array.isArray(data.data.documents)) {
        setDocuments(data.data.documents);
        await Promise.all(
          data.data.documents.map(async (doc: Document) => {
            try {
              if (!doc.id) {
                throw new Error(`Document ID missing for document: ${JSON.stringify(doc)}`);
              }
              const imgResponse = await fetch(
                `${env.api.baseUrl}:${env.api.port}/api/sumsub/documents/${sumsubId}/images/${doc.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (imgResponse.ok) {
                const blob = await imgResponse.blob();
                const url = URL.createObjectURL(blob);
                setImageUrls((prev) => ({ ...prev, [doc.id]: url }));
              } else {
                console.error(`Failed to fetch image for document ${doc.id}: ${imgResponse.status}`);
                setImageUrls((prev) => ({ ...prev, [doc.id]: '' }));
              }
            } catch (imgError) {
              console.error(`Error fetching image for document ${doc.id}:`, imgError);
              setImageUrls((prev) => ({ ...prev, [doc.id]: '' }));
            }
          })
        );
      } else {
        setError(data.message || 'Failed to fetch documents');
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Error fetching documents');
    } finally {
      setLoading(false);
    }
  }, [sumsubId, token]);

  useEffect(() => {
    fetchDocuments();
    return () => {
      Object.values(imageUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fetchDocuments, imageUrls]);

  const handleApprove = useCallback(() => {
    onStatusUpdate('approved');
    toast.success('KYC approved successfully');
  }, [onStatusUpdate]);

  const handleReject = useCallback(() => {
    if (rejectionReason.trim()) {
      onStatusUpdate('rejected', rejectionReason);
      toast.success('KYC rejected successfully');
    } else {
      toast.error('Please provide a rejection reason.');
    }
  }, [rejectionReason, onStatusUpdate]);

  const canReview = sumsubStatus === 'in_review';

  if (loading) {
    return (
      <Dialog open onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography color="error">{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={fetchDocuments} color="primary">
            Retry
          </Button>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h2">KYC Review</Typography>
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.neutral' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Username
                </Typography>
                <Typography variant="body1">{userData?.username || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1">{userData?.fullname || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{userData?.email || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">{userData?.phone_number || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">
                  {userData?.city && userData?.country
                    ? `${userData.city}, ${userData.country}`
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  KYC Status
                </Typography>
                <Typography
                  variant="body1"
                  color={sumsubStatus === 'in_review' ? 'warning.main' : 'success.main'}
                >
                  {sumsubStatus?.replace('_', ' ').toUpperCase() || 'Unknown'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        <Typography variant="h6" gutterBottom>
          Submitted Documents
        </Typography>

        {documents.length > 0 ? (
          <Box>
            {documents.map((doc) => (
              <Box key={doc.id} mb={3}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {doc.type} - {doc.side}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status: {doc.status}
                  </Typography>
                  {imageUrls[doc.id] ? (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={imageUrls[doc.id]}
                        alt={`${doc.type} - ${doc.side}`}
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          toast.error(`Failed to load image for ${doc.type} - ${doc.side}`);
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Typography color="error">Image not available</Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            ))}
            {canReview && (
              <TextField
                fullWidth
                label="Rejection Reason (if rejecting)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                multiline
                rows={4}
                margin="normal"
                placeholder="Provide a reason if rejecting the KYC."
              />
            )}
          </Box>
        ) : (
          <Typography>No documents found</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        {canReview && (
          <>
            <Button
              onClick={handleReject}
              color="error"
              variant="contained"
              disabled={!documents.length}
            >
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              color="primary"
              variant="contained"
              disabled={!documents.length}
            >
              Approve
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
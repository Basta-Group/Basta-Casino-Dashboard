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
import { toast } from 'react-toastify';
import { env } from 'src/config/env.config';

interface UserKYCReviewProps {
  userId: string;
  sumsubId: string;
  sumsubStatus: string | null | undefined;
  onClose: () => void;
  onStatusUpdate: (status: 'approved' | 'rejected', reason?: string) => void;
  token: string;
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
      if (data.success) {
        setDocuments(data.data.documents);
        await Promise.all(
          data.data.documents.map(async (doc: Document) => {
            try {
              const imgResponse = await fetch(
                `${env.api.baseUrl}:${env.api.port}/api/sumsub/documents/${sumsubId}/images/${doc.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (imgResponse.ok) {
                const blob = await imgResponse.blob();
                const url = URL.createObjectURL(blob);
                setImageUrls((prev) => ({ ...prev, [doc.id]: url }));
              }
            } catch (imgError) {
              console.error(`Error fetching image for document ${doc.id}:`, imgError);
            }
          })
        );
      } else {
        setError(data.message || 'Failed to fetch documents');
      }
    } catch (err) {
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
      <DialogTitle>KYC Review for User ID: {userId}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Sumsub ID: {sumsubId}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Status: {sumsubStatus || 'Unknown'}
        </Typography>
        {documents.length > 0 ? (
          <Box>
            {documents.map((doc) => (
              <Box key={doc.id} mb={2}>
                <Typography variant="subtitle1">
                  {doc.type} - {doc.side} (Status: {doc.status})
                </Typography>
                {imageUrls[doc.id] ? (
                  <img
                    src={imageUrls[doc.id]}
                    alt={`${doc.type} - ${doc.side}`}
                    style={{ maxWidth: '100%', marginTop: '10px' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      toast.error(`Failed to load image for ${doc.type} - ${doc.side}`);
                    }}
                  />
                ) : (
                  <CircularProgress size={24} />
                )}
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
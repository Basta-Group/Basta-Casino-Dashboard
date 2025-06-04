import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { env } from 'src/config/env.config';

interface KYCReviewProps {
  userId: string;
  sumsubId: string;
  onClose: () => void;
  onStatusUpdate: (status: 'approved' | 'rejected') => void;
}

export function UserKYCReview({ userId, sumsubId, onClose, onStatusUpdate }: KYCReviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  useEffect(() => {
    fetchDocuments();
  }, [sumsubId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${env.api.baseUrl}:${env.api.port}/api/auth/admin/kyc/${sumsubId}/documents`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setDocuments(data.data.documents);
      } else {
        setError(data.error || 'Failed to fetch documents');
      }
    } catch (err) {
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(
        `${env.api.baseUrl}:${env.api.port}/api/auth/admin/kyc/${sumsubId}/approve`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        onStatusUpdate('approved');
        onClose();
      } else {
        setError(data.error || 'Failed to approve KYC');
      }
    } catch (err) {
      setError('Failed to approve KYC');
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(
        `${env.api.baseUrl}:${env.api.port}/api/auth/admin/kyc/${sumsubId}/reject`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        onStatusUpdate('rejected');
        onClose();
      } else {
        setError(data.error || 'Failed to reject KYC');
      }
    } catch (err) {
      setError('Failed to reject KYC');
    }
  };

  if (loading) {
    return (
      <Dialog open onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Iconify icon="solar:document-bold" />
          <Typography variant="h6">KYC Document Review</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {documents.map((doc) => (
            <Card key={doc.id} sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">
                    {doc.type} - {doc.side}
                  </Typography>
                  <Label color={doc.status === 'approved' ? 'success' : 'warning'}>
                    {doc.status}
                  </Label>
                </Stack>

                <Box
                  component="img"
                  src={doc.url}
                  alt={`${doc.type} ${doc.side}`}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 400,
                    objectFit: 'contain',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedDocument(doc)}
                />
              </Stack>
            </Card>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Close
        </Button>
        <Button onClick={handleReject} variant="contained" color="error">
          Reject
        </Button>
        <Button onClick={handleApprove} variant="contained" color="success">
          Approve
        </Button>
      </DialogActions>

      {/* Document Preview Dialog */}
      <Dialog
        open={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          {selectedDocument && (
            <Box
              component="img"
              src={selectedDocument.url}
              alt={`${selectedDocument.type} ${selectedDocument.side}`}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { verifierService } from '../services/verifier/verifierService';
import toast from 'react-hot-toast';

// Query Keys
export const verifierKeys = {
  all: ['verifier'],
  verificationRequests: () => [...verifierKeys.all, 'verification-requests'],
  verificationRequest: (id) => [...verifierKeys.verificationRequests(), id],
  reports: () => [...verifierKeys.all, 'reports'],
};

// Verification Requests Hooks
export const useVerificationRequests = (params = {}) => {
  return useQuery({
    queryKey: [...verifierKeys.verificationRequests(), params],
    queryFn: () => verifierService.getVerificationRequests(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useVerificationRequestDetail = (requestId) => {
  return useQuery({
    queryKey: verifierKeys.verificationRequest(requestId),
    queryFn: () => verifierService.getVerificationRequestDetail(requestId),
    enabled: !!requestId,
  });
};

// Verification Actions
export const useVerifyEVData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, verificationData }) =>
      verifierService.verifyEVData(requestId, verificationData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: verifierKeys.verificationRequest(variables.requestId) });
      toast.success('Đã xác thực dữ liệu xe điện');
    },
    onError: (error) => {
      toast.error(error.message || 'Lỗi khi xác thực dữ liệu');
    },
  });
};

export const useValidateEmissionData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, validationData }) =>
      verifierService.validateEmissionData(requestId, validationData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: verifierKeys.verificationRequest(variables.requestId) });
      toast.success('Đã kiểm tra dữ liệu phát thải');
    },
    onError: (error) => {
      toast.error(error.message || 'Lỗi khi kiểm tra dữ liệu');
    },
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, approvalData }) =>
      verifierService.approveRequest(requestId, approvalData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: verifierKeys.verificationRequests() });
      queryClient.invalidateQueries({ queryKey: verifierKeys.verificationRequest(variables.requestId) });
      toast.success(`Đã duyệt yêu cầu ${variables.requestId}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Lỗi khi duyệt yêu cầu');
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, rejectionReason }) =>
      verifierService.rejectRequest(requestId, rejectionReason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: verifierKeys.verificationRequests() });
      queryClient.invalidateQueries({ queryKey: verifierKeys.verificationRequest(variables.requestId) });
      toast.error(`Đã từ chối yêu cầu ${variables.requestId}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Lỗi khi từ chối yêu cầu');
    },
  });
};

// Issue Credits Hook
export const useIssueCredits = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, creditData }) =>
      verifierService.issueCredits(requestId, creditData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: verifierKeys.verificationRequests() });
      queryClient.invalidateQueries({ queryKey: verifierKeys.verificationRequest(variables.requestId) });
      toast.success(`Đã phát hành ${creditData.amount} tín chỉ carbon`);
    },
    onError: (error) => {
      toast.error(error.message || 'Lỗi khi phát hành tín chỉ');
    },
  });
};

// Reports Hook
export const useVerifierReports = (params = {}) => {
  return useQuery({
    queryKey: [...verifierKeys.reports(), params],
    queryFn: () => verifierService.getReports(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


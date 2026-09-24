import { api } from "@/apis/api";
import type {
  AdminCertificate,
  CertificateFilters,
  CertificatesPagination,
} from "./types";

interface CertificatesResponse {
  certificates: AdminCertificate[];
  pagination: CertificatesPagination;
}

export const certificatesService = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCertificates: builder.query<
      CertificatesResponse,
      CertificateFilters
    >({
      query: (params) => ({
        url: "/api/certificates/admin/all",
        params,
      }),
      providesTags: ["Certificates"],
    }),

    // DELETE /api/certificates/revoke/:topicId/:userId
    revokeCertificate: builder.mutation<
      { message: string },
      { topicId: string; userId: string }
    >({
      query: ({ topicId, userId }) => ({
        url: `/api/certificates/revoke/${topicId}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Certificates"],
    }),
  }),
});

export const { useGetAdminCertificatesQuery, useRevokeCertificateMutation } =
  certificatesService;

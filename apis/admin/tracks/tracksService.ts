import { api } from "@/apis/api";
import type { Track, TrackPayload } from "./types";

export const tracksService = api.injectEndpoints({
  endpoints: (builder) => ({
    getActiveTracks: builder.query<Track[], void>({
      query: () => "/api/tracks",
      providesTags: ["Tracks"],
    }),

    getAllTracks: builder.query<Track[], void>({
      query: () => "/api/tracks/all",
      providesTags: ["Tracks"],
    }),

    createTrack: builder.mutation<Track, TrackPayload>({
      query: (payload) => ({
        url: "/api/tracks",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Tracks"],
    }),

    updateTrack: builder.mutation<
      Track,
      { id: string; payload: Partial<TrackPayload> & { isActive?: boolean } }
    >({
      query: ({ id, payload }) => ({
        url: `/api/tracks/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Tracks"],
    }),

    // DELETE /api/tracks/:id — hard-deletes the record
    deleteTrack: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/tracks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tracks"],
    }),
  }),
});

export const {
  useGetActiveTracksQuery,
  useGetAllTracksQuery,
  useCreateTrackMutation,
  useUpdateTrackMutation,
  useDeleteTrackMutation,
} = tracksService;

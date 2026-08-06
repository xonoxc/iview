import { useQuery } from "@tanstack/react-query"

import { roomQueryOptions } from "@/features/room/queries/room.queries"

export function useEnterRoom(roomId: string) {
   return useQuery(roomQueryOptions(roomId))
}

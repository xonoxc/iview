import { queryOptions } from "@tanstack/react-query"

import { unwrap } from "@/lib/result"
import { getRoom } from "@/features/room/requests/get-room"

export function roomQueryOptions(roomId: string) {
   return queryOptions({
      queryKey: ["room", roomId],
      queryFn: () => unwrap(getRoom(roomId)),
   })
}

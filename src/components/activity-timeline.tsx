import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TimelineItem {
  id: number
  date: string
  title: string
  address: string
  type: "question" | "report" | "request"
  daysAgo: number
}

const timelineItems: TimelineItem[] = [
  {
    id: 1,
    date: "9",
    title: "Pet Friendliness",
    address: "196 Kansas Avenue, Block A, 7th Floor, Number 14",
    type: "question",
    daysAgo: 2,
  },
  {
    id: 2,
    date: "9",
    title: "Water Issue",
    address: "917 Garden Street, Santa Monica, CA 987 360",
    type: "report",
    daysAgo: 2,
  },
  {
    id: 3,
    date: "7",
    title: "Invoice Inquiry",
    address: "568 Gotham Center, Santa Monica, CA 987 360",
    type: "request",
    daysAgo: 3,
  },
]

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">New activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-8">
            {timelineItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-8 text-center">
                  <div className="text-sm font-medium">{item.date}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.title}</span>
                    <Badge
                      variant="outline"
                      className={
                        item.type === "question"
                          ? "border-blue-500 text-blue-500"
                          : item.type === "report"
                          ? "border-red-500 text-red-500"
                          : "border-green-500 text-green-500"
                      }
                    >
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.address}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.daysAgo} days ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}


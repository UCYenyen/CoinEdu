import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  CircleIcon,
  PieChartIcon,
  ShieldIcon,
} from "lucide-react"

const modules = [
  {
    title: "Market Cap",
    description:
      "Discover how total value is measured and why it matters beyond coin price.",
    cta: "Resume Module",
    status: "active",
    progress: 62,
    icon: PieChartIcon,
  },
  {
    title: "Volatility",
    description:
      "Analyze price swings and learn strategies to navigate rapid market moves safely.",
    cta: "Start Module",
    status: "next",
    progress: 0,
    icon: ArrowUpRightIcon,
  },
  {
    title: "Risk Management",
    description:
      "Build a survival plan with stop-losses, sizing discipline, and capital protection.",
    cta: "Start Module",
    status: "locked",
    progress: 0,
    icon: ShieldIcon,
  },
  {
    title: "Diversification",
    description:
      "Avoid concentration risk and learn to construct a resilient multi-asset portfolio.",
    cta: "Start Module",
    status: "locked",
    progress: 0,
    icon: CircleIcon,
  },
] as const

const quizOptions = [
  "Price of one coin multiplied by total supply in circulation",
  "Daily trading volume multiplied by market sentiment",
  "Number of holders divided by current token price",
]

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="grid flex-1 gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Curriculum</h2>
              <Badge variant="outline">4 Modules</Badge>
            </div>

            <div className="space-y-3">
              {modules.map((module) => {
                const Icon = module.icon
                const isActive = module.status === "active"

                return (
                  <Card
                    key={module.title}
                    className={[
                      "gap-4 bg-card/80 py-4",
                      isActive
                        ? "ring-primary/70 shadow-[0_0_0_1px_hsl(var(--primary)/0.45)]"
                        : "ring-border/80",
                    ].join(" ")}
                  >
                    <CardHeader className="px-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <CardTitle className="text-xl font-semibold">
                            {module.title}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {module.description}
                          </CardDescription>
                        </div>
                        <Icon className="mt-1 size-5 text-muted-foreground" />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4">
                      {isActive ? (
                        <div className="h-2 overflow-hidden rounded-full bg-background/70">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      ) : null}

                      <Button
                        variant={isActive ? "ghost" : "outline"}
                        className="w-full justify-center"
                      >
                        {module.cta}
                        {isActive ? <ArrowRightIcon className="size-4" /> : null}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          <section className="space-y-4">
            <Card className="bg-gradient-to-b from-card to-card/80 py-5">
              <CardHeader className="space-y-4 px-6">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <span>Fundamental Analysis</span>
                  <span className="text-muted-foreground/60">{">"}</span>
                  <span className="text-foreground">Market Cap</span>
                </div>
                <CardTitle className="text-4xl font-semibold tracking-tight">
                  Understanding Market Cap
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 px-6 text-base leading-8 text-muted-foreground">
                <p>
                  Market capitalization is the total value of all coins that have
                  been mined. It is calculated by multiplying the current market
                  price of a single coin by the total number of coins in
                  circulation.
                </p>
                <p>
                  While beginners often focus on the individual coin price,
                  experienced investors use market cap to understand the relative
                  size and maturity of one project compared to others.
                </p>

                <div className="rounded-lg border border-secondary/30 bg-black/80 p-4 text-sm text-secondary">
                  <p className="mb-2 text-xs font-semibold tracking-wide uppercase">
                    Example Calculation
                  </p>
                  <p className="leading-7 text-secondary">
                    If Coin X has 1 million coins in circulation and is priced at
                    $5 per coin, then market cap = $5,000,000.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/90 py-5">
              <CardHeader className="space-y-3 px-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-md border border-border bg-muted p-2">
                    <CheckCircle2Icon className="size-5 text-tertiary" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-semibold tracking-tight">
                      Knowledge Check
                    </CardTitle>
                    <CardDescription className="text-xs font-medium tracking-[0.14em] uppercase">
                      100 XP Reward
                    </CardDescription>
                  </div>
                </div>
                <p className="pt-1 text-lg font-medium text-foreground">
                  How is market cap calculated?
                </p>
              </CardHeader>

              <CardContent className="grid gap-3 px-6 md:grid-cols-2">
                {quizOptions.map((option, index) => (
                  <Button
                    key={option}
                    variant={index === 0 ? "secondary" : "outline"}
                    className="h-auto justify-start py-3 text-left leading-relaxed whitespace-normal"
                  >
                    {option}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

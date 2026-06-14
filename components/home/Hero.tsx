import { ArrowRight, CheckCircle2,  Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";


export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

        <div className="absolute bottom-0 left-1/4 h-75 w-75 rounded-full bg-primary/10 blur-[100px]" />

        <div className="absolute right-1/4 top-1/3 h-62.5 w-62.5 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      {/* Grid Background */}
      <div className="bg-grid absolute inset-0 -z-20 opacity-40" />

      <div className="container py-28 md:py-36">
        <div className="mx-auto max-w-5xl text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm shadow-sm backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-powered meeting intelligence
          </div>

          {/* Heading */}
          <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-7xl">
            Turn meetings into

            <span className="relative block text-primary">
              structured action plans

              {/* Text Glow */}
              <span className="absolute inset-0 -z-10 bg-primary/20 blur-3xl" />
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Upload transcripts or voice notes and let Minutely extract
            summaries, action items, deadlines, decisions, and owners.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/upload" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-12 rounded-2xl px-8 text-base shadow-lg shadow-primary/20"
            >
              Try Minutely
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>

          <Link href="/demo" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-2xl px-8 text-base backdrop-blur"
            >
              Live Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              AI summaries
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Smart action extraction
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Real-time task board
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mt-20">

            {/* Card Glow */}
            <div className="absolute inset-0 -z-20 flex items-center justify-center">
              <div className="h-112.5 w-112.5 rounded-full bg-primary/20 blur-[120px]" />
            </div>

            {/* Border Glow */}
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-linear-to-r from-primary/20 via-primary/5 to-primary/20 blur-2xl" />

            <Card className="relative overflow-hidden border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">

              {/* Shine */}
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

              {/* Window Header */}
              <div className="border-b bg-muted/40 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
              </div>

              {/* Content */}
              <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">

                {/* Left Side */}
                <div className="rounded-2xl border bg-background/80 p-5 text-left backdrop-blur">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">
                      Product Strategy Meeting
                    </h3>

                    <div className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      Processed
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-muted-foreground">
                    The team discussed launch timelines, onboarding flows,
                    pricing updates, and engineering deliverables for Q3.
                    Action items were assigned across product, design, and
                    backend teams.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="rounded-xl border bg-background/60 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          Finalize onboarding screens
                        </p>

                        <span className="text-xs text-muted-foreground">
                          High Priority
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Assigned to Sarah • Due Friday
                      </p>
                    </div>

                    <div className="rounded-xl border bg-background/60 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          Update pricing documentation
                        </p>

                        <span className="text-xs text-muted-foreground">
                          Medium Priority
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Assigned to Michael • Due Monday
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="space-y-6">

                  <div className="rounded-2xl border bg-background/80 p-5 text-left backdrop-blur">
                    <p className="text-sm font-medium">
                      Key Decisions
                    </p>

                    <div className="mt-4 space-y-3">
                      <div className="rounded-xl bg-muted/50 p-3 text-sm">
                        Launch moved to July 18
                      </div>

                      <div className="rounded-xl bg-muted/50 p-3 text-sm">
                        Freemium pricing approved
                      </div>

                      <div className="rounded-xl bg-muted/50 p-3 text-sm">
                        Mobile onboarding prioritized
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-background/80 p-5 text-left backdrop-blur">
                    <p className="text-sm font-medium">
                      Participants
                    </p>

                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Sarah Johnson
                        </span>

                        <span className="text-xs text-muted-foreground">
                          Product Lead
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Michael Chen
                        </span>

                        <span className="text-xs text-muted-foreground">
                          Engineering
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Emma Davis
                        </span>

                        <span className="text-xs text-muted-foreground">
                          Design
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
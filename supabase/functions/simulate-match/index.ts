import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { simulateInnings } from '../_shared/sim-engine.ts'
import { MatchConfig } from '../_shared/types.ts'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const config = (await req.json()) as MatchConfig
    if (!config || !config.playingXIHome || !config.playingXIAway) {
      return new Response('Invalid payload', { status: 400 })
    }

    const homeEvents = simulateInnings(config, config.playingXIHome, config.playingXIAway)
    const awayEvents = simulateInnings(config, config.playingXIAway, config.playingXIHome)

    return new Response(
      JSON.stringify({
        homeEvents,
        awayEvents,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

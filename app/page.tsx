'use client'

import { useConnect, useConnection, useConnectors, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, Unplug } from 'lucide-react'
import { injected } from 'wagmi/connectors'

function App() {
  const connection = useConnection()
  const connect = useConnect()
  const connectors = useConnectors()
  const disconnect = useDisconnect()

  const getStatusBadge = () => {
    switch (connection.status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>
      case 'connecting':
        return <Badge variant="secondary">Connecting...</Badge>
      case 'disconnected':
        return <Badge variant="outline">Disconnected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Wallet Connection</h1>
          <p className="text-muted-foreground">Connect your wallet to interact with the application</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Connection Status
            </CardTitle>
            <CardDescription>
              Current wallet connection information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              {getStatusBadge()}
            </div>

            {connection.status === 'connected' && (
              <>
                <div className="space-y-2">
                  <span className="font-medium">Addresses:</span>
                  <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                    {connection.addresses?.join(', ') || 'None'}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-medium">Chain ID:</span>
                  <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                    {connection.chainId || 'Unknown'}
                  </div>
                </div>

                <Button
                  onClick={() => disconnect.mutate()}
                  variant="destructive"
                  className="w-full"
                >
                  <Unplug className="h-4 w-4 mr-2" />
                  Disconnect Wallet
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Choose a wallet provider to connect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  onClick={() => connect.mutate({ connector:injected() })}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={connect.status === 'pending'}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {connector.name}
                </Button>
              ))}
            </div>

            {connect.status === 'pending' && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Connecting...
              </div>
            )}

            {connect.error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">
                  Error: {connect.error.message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

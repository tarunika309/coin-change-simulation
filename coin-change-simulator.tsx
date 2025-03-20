"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, RefreshCw, Calculator, DollarSign, Coins } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Predefined coin sets
const COIN_SETS = {
  US: [1, 5, 10, 25, 50, 100],
  EU: [1, 2, 5, 10, 20, 50, 100, 200],
  UK: [1, 2, 5, 10, 20, 50, 100, 200],
  Custom: [],
}

export default function CoinChangeSimulator() {
  const [coinSet, setCoinSet] = useState<string>("US")
  const [customCoins, setCustomCoins] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [result, setResult] = useState<{ coins: number[]; count: number } | null>(null)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Get the current coin denominations based on selected set
  const getCoins = (): number[] => {
    if (coinSet === "Custom") {
      return customCoins
        .split(",")
        .map((coin) => Number.parseInt(coin.trim()))
        .filter((coin) => !isNaN(coin) && coin > 0)
        .sort((a, b) => a - b)
    }
    return [...COIN_SETS[coinSet as keyof typeof COIN_SETS]]
  }

  // Calculate minimum coins using greedy algorithm
  const calculateChange = () => {
    setError(null)
    setIsCalculating(true)

    // Validate inputs
    const targetAmount = Number.parseInt(amount)
    if (isNaN(targetAmount) || targetAmount <= 0) {
      setError("Please enter a valid positive amount")
      setIsCalculating(false)
      return
    }

    const coins = getCoins()
    if (coins.length === 0) {
      setError("Please enter valid coin denominations")
      setIsCalculating(false)
      return
    }

    // Sort coins in descending order for greedy approach
    const sortedCoins = [...coins].sort((a, b) => b - a)

    // Apply greedy algorithm
    let remaining = targetAmount
    const usedCoins: number[] = Array(sortedCoins.length).fill(0)

    sortedCoins.forEach((coin, index) => {
      while (remaining >= coin) {
        remaining -= coin
        usedCoins[index]++
      }
    })

    // Check if we couldn't make exact change
    if (remaining > 0) {
      setError("Cannot make exact change with these denominations")
      setIsCalculating(false)
      return
    }

    // Format result
    const resultCoins: number[] = []
    sortedCoins.forEach((coin, index) => {
      for (let i = 0; i < usedCoins[index]; i++) {
        resultCoins.push(coin)
      }
    })

    // Simulate calculation delay for visual effect
    setTimeout(() => {
      setResult({
        coins: resultCoins,
        count: resultCoins.length,
      })
      setIsCalculating(false)
    }, 600)
  }

  const resetSimulation = () => {
    setAmount("")
    setResult(null)
    setError(null)
  }

  const handleCustomCoinsChange = (value: string) => {
    setCustomCoins(value)
    setResult(null)
  }

  const formatCurrency = (value: number): string => {
    if (coinSet === "US") {
      return `$${(value / 100).toFixed(2)}`
    } else if (coinSet === "EU") {
      return `€${(value / 100).toFixed(2)}`
    } else if (coinSet === "UK") {
      return `£${(value / 100).toFixed(2)}`
    }
    return `${(value / 100).toFixed(2)}`
  }

  // Get coin color based on denomination
  const getCoinColor = (value: number): string => {
    if (coinSet === "US") {
      if (value === 1) return "bg-zinc-400" // Penny
      if (value === 5) return "bg-zinc-500" // Nickel
      if (value === 10) return "bg-zinc-400" // Dime
      if (value === 25) return "bg-zinc-300" // Quarter
      if (value === 50) return "bg-zinc-300" // Half dollar
      if (value === 100) return "bg-amber-300" // Dollar
    } else if (coinSet === "EU" || coinSet === "UK") {
      if (value <= 5) return "bg-amber-600" // Copper
      if (value <= 50) return "bg-yellow-300" // Gold
      return "bg-zinc-300" // Silver
    }

    // Default colors for custom coins
    if (value < 5) return "bg-zinc-400"
    if (value < 25) return "bg-zinc-300"
    if (value < 100) return "bg-yellow-300"
    return "bg-amber-300"
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
                <Coins className="h-6 w-6" />
                Coin Change Simulator
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Calculate the minimum number of coins needed to make change
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <InfoIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    This simulation mimics cashier systems and financial transactions where efficient change dispensing
                    is crucial.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent className="pt-6 grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coin-set">Coin Denominations</Label>
                <Select
                  value={coinSet}
                  onValueChange={(value) => {
                    setCoinSet(value)
                    setResult(null)
                  }}
                >
                  <SelectTrigger id="coin-set">
                    <SelectValue placeholder="Select coin set" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">US Coins (1¢, 5¢, 10¢, 25¢, 50¢, $1)</SelectItem>
                    <SelectItem value="EU">Euro Coins (1¢, 2¢, 5¢, 10¢, 20¢, 50¢, €1, €2)</SelectItem>
                    <SelectItem value="UK">UK Coins (1p, 2p, 5p, 10p, 20p, 50p, £1, £2)</SelectItem>
                    <SelectItem value="Custom">Custom Denominations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {coinSet === "Custom" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-coins">Custom Coin Values (comma-separated)</Label>
                  <Input
                    id="custom-coins"
                    placeholder="1, 5, 10, 25"
                    value={customCoins}
                    onChange={(e) => handleCustomCoinsChange(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Enter values in cents/pennies (e.g., 25 = 25¢)</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Make Change For</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    placeholder="Enter amount in cents/pennies"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Enter value in cents/pennies (e.g., 87 = 87¢)</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={calculateChange} disabled={isCalculating || !amount} className="flex-1">
                  {isCalculating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate Change
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetSimulation} className="flex-none">
                  Reset
                </Button>
              </div>

              {error && <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded-md">{error}</div>}
            </div>

            {/* Output Section */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border">
              <h3 className="text-lg font-medium mb-3">Result</h3>

              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Target Amount:</span>
                    <Badge variant="outline" className="text-base font-bold">
                      {formatCurrency(Number.parseInt(amount))}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Minimum Coins Required:</span>
                    <Badge className="text-base">{result.count}</Badge>
                  </div>

                  <div className="pt-2">
                    <span className="text-sm font-medium block mb-2">Coins Used:</span>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {result.coins.map((coin, index) => (
                          <motion.div
                            key={`${coin}-${index}`}
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                              delay: index * 0.05,
                            }}
                            className={`${getCoinColor(coin)} rounded-full flex items-center justify-center text-xs font-bold h-12 w-12 shadow-md`}
                          >
                            {coin}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-sm font-medium block mb-1">Breakdown:</span>
                    <div className="text-sm">
                      {Array.from(new Set(result.coins)).map((coin) => {
                        const count = result.coins.filter((c) => c === coin).length
                        return (
                          <div
                            key={coin}
                            className="flex justify-between py-1 border-b border-dashed border-slate-200 dark:border-slate-700"
                          >
                            <span>{formatCurrency(coin)} coins:</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                  <Coins className="h-12 w-12 mb-2 opacity-20" />
                  <p>Enter an amount and click Calculate to see the minimum coins needed</p>
                </div>
              )}
            </div>
          </div>

          {/* Algorithm Explanation */}
          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-4">
              <h3 className="text-lg font-medium mb-2">How It Works</h3>
              <p className="text-sm">
                This simulator uses a <strong>greedy algorithm</strong> to find the minimum number of coins needed to
                make change:
              </p>
              <ol className="text-sm mt-2 space-y-1 list-decimal list-inside">
                <li>The algorithm always selects the largest possible coin at each step.</li>
                <li>It continues selecting coins until the target amount is reached.</li>
                <li>This approach works optimally for standard coin systems like US, Euro, and UK.</li>
              </ol>
              <p className="text-sm mt-2 text-muted-foreground">
                Note: For some custom coin sets, the greedy approach may not always produce the optimal solution.
              </p>
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter className="bg-slate-50 dark:bg-slate-800/50 text-sm text-muted-foreground">
          <p>
            This simulation mimics real-world cashier systems and vending machines that need to efficiently dispense
            change.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


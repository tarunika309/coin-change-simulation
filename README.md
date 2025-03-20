💰 Coin Change Simulator using Greedy Algorithm
🚀 A fast and efficient coin change simulation that uses the Greedy Algorithm to minimize the number of coins required for a given amount.

📌 Features
✅ Fast & Lightweight – Uses a Greedy approach for quick calculations.
✅ Real-Time Simulation – Enter an amount and get an optimal solution instantly.
✅ Custom Denominations – Works with various currency systems.
✅ Extensible & Modular – Easily integrates with other applications.

⚡ How It Works
1️⃣ Sort coins in descending order.
2️⃣ Pick the largest coin that fits into the remaining amount.
3️⃣ Subtract its value from the remaining amount.
4️⃣ Repeat until the amount becomes zero.

🔹 Example:
For coins {1, 5, 10, 25} and amount 30, the algorithm selects:
25 (remaining: 5)
5 (remaining: 0)
📌 Total coins used: 2

📈 Time Complexity
🔹 Unsorted Coins:
O(NlogN) (due to sorting)
🔹 Pre-sorted Coins: 
O(N) (single pass selection)
🔹 Space Complexity: 
O(1) (constant space usage)

💡 Advantages
✅ Fast Execution: Runs in near-linear time.
✅ Simple Implementation: Requires only basic sorting and iteration.
✅ Optimized for Certain Cases: Works perfectly when denominations follow a canonical system (e.g., U.S. currency).

🎯 Use Cases
💰 Banking & ATMs – Optimizing cash dispensing systems.
🎮 Gaming & Virtual Currencies – In-game currency exchange simulations.
🛒 E-commerce & Transactions – Faster change return calculations.
🤖 Vending Machines – Ensuring minimal coin usage.

🌟 Uniqueness
🔹 Real-Time Coin Calculation – Dynamically calculates the best coin combination.
🔹 Custom Denominations – Adaptable to different currency systems.
🔹 Extensible for Other Approaches – Can be compared with Dynamic Programming.

🔮 Scope for Advancement
🚀 Handling Non-Greedy Cases:
Implement Dynamic Programming (DP) for cases where Greedy fails.
Example: Coins {1, 3, 4} for amount 6 (Greedy picks 4+1+1, but the optimal is 3+3).
🚀 Multi-Currency Support:
Expand to support various international currencies.
🚀 Graphical User Interface (GUI):
Develop a React/Next.js frontend for a web-based interactive tool.

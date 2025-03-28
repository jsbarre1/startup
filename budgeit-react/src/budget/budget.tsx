import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import Notification from "./notification";
import { AuthState } from "../app";
import UnauthorizedMessage from "../login/unauthorizedMessage";

type tType =
  | "income"
  | "grocery"
  | "gas"
  | "school"
  | "doctor"
  | "fast food"
  | "car maintenance"
  | "rent"
  | "error";

const transactionTypes: tType[] = [
  "income",
  "grocery",
  "gas",
  "school",
  "doctor",
  "fast food",
  "car maintenance",
  "rent",
];

interface Transaction {
  date: Date;
  amount: string;
  type: tType;
  userName?: string; 
}

interface PieChartData {
  name: string;
  value: number;
}

export function Budget({ authState, userName }: { userName: string, authState: AuthState }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    type: "income" as tType,
  });
  const [hasScored, setHasScored] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pieData, setPieData] = useState<
    Array<{ name: string; value: number }>
  >([]);

  if(authState === AuthState.Unauthenticated){
    return (<UnauthorizedMessage/>)
  }

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
    "#6B66FF",
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
                
        const response = await fetch(`/api/transactions?userName=${encodeURIComponent(userName || '')}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include" 
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log("Received transactions:", data);
        
        const processedTransactions = data.map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }));
    
        setTransactions(processedTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const expensesByType = transactions.reduce((acc, transaction) => {
      if (transaction.type === "income") return acc;

      const amount = parseFloat(transaction.amount);
      if (!isNaN(amount)) {
        acc[transaction.type] = (acc[transaction.type] || 0) + amount;
      }
      return acc;
    }, {} as Record<string, number>);

    const formattedData: PieChartData[] = Object.keys(expensesByType).map(
      (type) => ({
        name: type,
        value: Number(expensesByType[type].toFixed(2)),
      })
    );

    setPieData(formattedData);
  }, [transactions]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.date || !newTransaction.amount) return;

    try {
      setError(null);
      
      const [year, month, day] = newTransaction.date.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      
      const transaction = {
        date: dateObj,
        amount: newTransaction.amount,
        type: newTransaction.type,
        userName: userName
      };

      console.log("Sending transaction:", transaction);
      
      const transactionResponse = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
       body: JSON.stringify({
          date: dateObj,
          amount: newTransaction.amount,
          type: newTransaction.type,
          userName: userName
        }),
      });

      if (!transactionResponse.ok) {
        console.error("Transaction response:", await transactionResponse.text());
        throw new Error(`Failed to add transaction: ${transactionResponse.statusText}`);
      }

      console.log("Transaction added successfully");
      
      setTransactions([...transactions, {
        date: dateObj,
        amount: newTransaction.amount,
        type: newTransaction.type,
        userName: userName
      }]);
      setNewTransaction({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        type: "income",
      });

      const scoreResponse = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          score: 100,
        }),
      });

      if (scoreResponse.ok) {
        setHasScored(true);
      } else {
        console.error("Failed to update score");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add transaction. Please try again.");
    }
  };

  const formatTooltipValue = (
    value: number | string | Array<number | string>
  ) => {
    if (typeof value === "number") {
      return `$${value.toFixed(2)}`;
    }
    return `$${value}`;
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading transactions...</div>;
  }

  return (
    <>
      {hasScored ? (
        <Notification setState={setHasScored}>
          MEOW! You scored 100 points!
        </Notification>
      ) : null}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}
      
      <main className="pt-6 flex flex-col">
        <h1 className="text-center">Welcome {userName} to MyBudget!</h1>

        <div className="flex flex-col self-center w-full md:w-[800px] rounded-lg shadow-md text-center pt-2">
          <form onSubmit={handleAddTransaction}>
            <div className="flex flex-row ring-2 shadow-md ring-blue-400 bg-blue-400 justify-evenly rounded-xl">
              <input
                className="bg-white text-center rounded-2xl text-sm w-[110px] lg:w-[200px]"
                type="date"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, date: e.target.value })
                }
              />
              <input
                className="bg-white text-center rounded-2xl text-sm w-[110px] lg:w-[200px]"
                type="number"
                step=".01"
                placeholder="amount"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
              />
              <select
                className="bg-white text-center rounded-2xl text-sm w-28 lg:w-40"
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    type: e.target.value as tType,
                  })
                }
              >
                {transactionTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <button
                className="bg-white rounded-2xl text-center text-sm w-[50px] lg:w-[100px]"
                type="submit"
              >
                add
              </button>
            </div>
          </form>
        </div>
        {transactions.length > 0 ? (
          <>
            {pieData.length > 0 ? (
              <div className="w-full md:w-[800px] border border-green-50 rounded-lg self-center mt-6">
                <div className="bg-white rounded-lg shadow-md p-4 w-full">
                  <h3 className="text-center font-semibold mb-2">
                    Expenses by Category
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => `${formatTooltipValue(value)}`}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-row justify-around w-full">
                    <div className="text-center text-sm mt-2">
                      Total Expenses: $
                      {pieData
                        .reduce((sum, item) => sum + item.value, 0)
                        .toFixed(2)}
                    </div>
                    <div className="text-center text-sm mt-2">
                      Total Income: $
                      {transactions
                        .filter((item) => item.type === "income")
                        .reduce((sum, item) => sum + parseFloat(item.amount), 0)
                        .toFixed(2)}
                    </div>
                    <div className="text-center text-sm mt-2">
                      Net: $
                      {(
                        transactions
                          .filter((item) => item.type === "income")
                          .reduce(
                            (sum, item) => sum + parseFloat(item.amount),
                            0
                          ) - pieData.reduce((sum, item) => sum + item.value, 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col bg-gray-200 self-center w-full md:w-[800px] mt-2 rounded-lg shadow-md text-center">
              Recent:
              <div className="flex flex-col rounded-xl">
                {transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className={`flex flex-row justify-evenly ${
                      transaction.type === "income"
                        ? "bg-green-200"
                        : "bg-red-200"
                    } shadow-md rounded-2xl mt-1`}
                  >
                    <div className="text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
                      {transaction.date.toLocaleDateString()}
                    </div>
                    <div className="text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
                      {transaction.type}
                    </div>
                    <div className="text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
                      {transaction.type === "income" ? (
                        <span>+</span>
                      ) : (
                        <span>-</span>
                      )}
                      ${transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full md:w-[800px] self-center mt-8 mb-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl shadow-sm border border-green-100 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <h3 className="text-xl font-medium text-gray-800">
                Get started by adding transactions!
              </h3>
              <p className="text-gray-600 max-w-md">
                Track your spending and income to gain insights into your
                financial habits.
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
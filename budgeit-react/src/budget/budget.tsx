import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

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
}

interface PieChartData {
  name: string;
  value: number;
}

export function Budget({ userName }: { userName: string }) {
  const sampleData: Transaction[] = [
    {
      date: new Date(2024, 11, 31),
      amount: "24.35",
      type: "gas",
    },
    {
      date: new Date(2025, 0, 1),
      amount: "500",
      type: "rent",
    },
    {
      date: new Date(2025, 0, 4),
      amount: "24.35",
      type: "fast food",
    },
    {
      date: new Date(2025, 0, 5),
      amount: "65.35",
      type: "grocery",
    },
  ];

  const [transactions, setTransactions] = useState<Transaction[]>(sampleData);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    amount: "",
    type: "error" as tType,
  });
  const [pieData, setPieData] = useState<
    Array<{ name: string; value: number }>
  >([]);

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

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.date || !newTransaction.amount) return;

    const transaction: Transaction = {
      date: new Date(newTransaction.date),
      amount: newTransaction.amount,
      type: newTransaction.type,
    };

    setTransactions([...transactions, transaction]);
    setNewTransaction({ date: "", amount: "", type: "grocery" });
  };

  const formatTooltipValue = (
    value: number | string | Array<number | string>
  ) => {
    if (typeof value === "number") {
      return `$${value.toFixed(2)}`;
    }
    return `$${value}`;
  };

  return (
    <main className="pt-6 flex flex-col">
      <h1 className="text-center">Welcome {userName} to MyBudget!</h1>

      <div>
        <button className="p-1 w-[80px] lg:w-[100px] rounded-3xl bg-blue-500 shadow-md text-white text-xs">
          edit plan
        </button>
      </div>
      <div className="flex flex-col self-center w-full md:w-[800px] rounded-lg shadow-md text-center pt-2">
        <form onSubmit={handleAddTransaction}>
          <div className="flex flex-row ring-2 shadow-md ring-blue-400 bg-blue-400 justify-evenly rounded-xl">
            <input
              className="bg-white text-center rounded-2xl text-sm w-[110px] lg:w-[200px]"
              type="date"
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, date: e.target.value })
              }
            />
            <input
              className="bg-white text-center rounded-2xl text-sm w-[110px] lg:w-[200px]"
              type="number"
              step=".01"
              placeholder="amount"
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, amount: e.target.value })
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
              {transactionTypes.map((type) => (
                <option key={type} value={type}>
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
      <div className="w-full md:w-[800px] border border-green-50 rounded-lg mb-2 self-center mt-6">
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
          <div className="text-center text-sm mt-2">
            Total Expenses: $
            {pieData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-gray-200 self-center w-full md:w-[800px] rounded-lg shadow-md text-center">
        Recent:
        <div className="flex flex-col rounded-xl">
          {transactions.map((transaction) => (
            <div className="flex flex-row justify-evenly bg-blue-300 shadow-md rounded-2xl mt-1">
              <div className=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
                {transaction.date.toLocaleDateString()}
              </div>
              <div className=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
                {transaction.type}
              </div>
              <div className=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
                ${transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

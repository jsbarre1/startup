import React, { useState } from "react";

type tType =
  | "income"
  | "grocery"
  | "gas"
  | "school"
  | "doctor"
  | "fast food"
  | "car maintenance" |"rent" | "error";

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

export function Budget({ userName }: { userName: string }) {
  const sampleData: Transaction[] = [
    {
      date: new Date(2024, 11, 31), // Month is 0-indexed (11 = December)
      amount: "24.35",
      type: "gas",
    },
    {
      date: new Date(2025, 0, 1), // 0 = January
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
    type: "error" as tType
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.date || !newTransaction.amount) return;
    
    const transaction: Transaction = {
      date: new Date(newTransaction.date),
      amount: newTransaction.amount,
      type: newTransaction.type
    };
    
    setTransactions([...transactions, transaction]);
    setNewTransaction({ date: "", amount: "", type: "grocery" });
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
        <form method="get" action="">
          <div className="flex flex-row ring-2 shadow-md ring-blue-400 bg-blue-400 justify-evenly rounded-xl">
            <input
              className="bg-white text-center rounded-2xl text-sm w-[110px] lg:w-[200px]"
              type="date"
              onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}

            />
            <input
              className="bg-white text-center rounded-2xl text-sm w-[110px] lg:w-[200px]"
              type="number"
              step=".01"
              placeholder="amount"
              onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}

            />
             <select
              className="bg-white text-center rounded-2xl text-sm w-28 lg:w-40"
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as tType})}
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
      <div className="flex flex-row self-center mt-4">
        <img
          src="../../public/pie_chart_placeholder.png"
          alt="pie chart placeholder"
        />
        <img
          src="../../public/bar_graph_placeholder.png"
          alt="bar graph placeholder"
        />
      </div>
      <div className="flex flex-col bg-gray-200 self-center w-full md:w-[800px] rounded-lg shadow-md text-center">
        Recent:
        <div className="flex flex-col rounded-xl">
          {transactions.map((transaction)=>(
            <div className="flex flex-row justify-evenly bg-blue-300 shadow-md rounded-2xl mt-1">
            <div className=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
            {transaction.date.toLocaleDateString()}
            </div>
            <div className=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
            {transaction.date.toLocaleDateString()}
            </div>
            <div className=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
            ${transaction.date.toLocaleDateString()}
            </div>
          </div>
          ))}
        </div>
      </div>
    </main>
  );
}

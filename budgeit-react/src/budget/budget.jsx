import React from "react";

export function Budget() {
  return (
    <main class="pt-6 flex flex-col">
      <h1 class="text-center">Welcome (username) to MyBudget!</h1>

      <div>
        <button class="p-1 w-[80px] lg:w-[100px] rounded-3xl bg-blue-500 shadow-md text-white text-xs">
          edit plan
        </button>
      </div>
      <div class="flex flex-col self-center w-full md:w-[800px] rounded-lg shadow-md text-center pt-2">
        <form method="get" action="">
          <div class="flex flex-row ring-2 shadow-md ring-blue-400 bg-blue-400 justify-evenly rounded-xl">
            <input
              class="bg-white text-center rounded-2xl text-sm w-[110px] lg:w-[200px]"
              type="date"
            />
            <input
              class="bg-white text-center rounded-2xl text-sm w-[110px] lg:w-[200px]"
              type="number"
              step=".01"
              placeholder="amount"
            />
            <select
              class="bg-white text-center rounded-2xl text-sm w-[110px] lg:w-[200px]"
              aria-placeholder="category"
            >
              <option value="income">income</option>
              <option value="grocery">grocery</option>
              <option value="gas">gas</option>
              <option value="school">school</option>
              <option value="doctor">doctor</option>
              <option value="fast food">fast food</option>
              <option value="car maintanence">car maintanence</option>
            </select>
            <button
              class="bg-white rounded-2xl text-center text-sm w-[50px] lg:w-[100px]"
              type="submit"
            >
              add
            </button>
          </div>
        </form>
      </div>
      <div class="flex flex-row self-center mt-4">
        <img

          src="./public/pie_chart_placeholder.png"
          alt="pie chart placeholder"
        />
        <img
          src="./public/bar_graph_placeholder.png"
          alt="bar graph placeholder"
        />
      </div>
      <div class="flex flex-col bg-gray-200 self-center w-full md:w-[800px] rounded-lg shadow-md text-center">
        Recent:
        <div class="flex flex-col rounded-xl">
          <div class="flex flex-row justify-evenly bg-blue-300 shadow-md rounded-2xl">
            <div class=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
              12/31/2024
            </div>
            <div class=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
              gas
            </div>
            <div class=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
              $24.35
            </div>
          </div>
          <div class="flex flex-row justify-evenly bg-blue-300 shadow-md rounded-2xl mt-1">
            <div class=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
              01/05/2025
            </div>
            <div class=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
              grocery
            </div>
            <div class=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
              $65.35
            </div>
          </div>
          <div class="flex flex-row justify-evenly bg-blue-300 shadow-md rounded-2xl mt-1">
            <div class=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
              01/20/25
            </div>
            <div class=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
              rent
            </div>
            <div class=" text-center rounded-2xl text-sm w-[110px] lg:w-[200px]">
              $400.67
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

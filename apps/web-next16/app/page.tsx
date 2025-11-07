"use client";

// 1. Сіздің кітапханаңыздан импорт!
import { Conditional } from "@sayyyat/react-query-conditional";
import { useQuery } from "@tanstack/react-query";
import React from "react";

// Бұл компонент біздің кітапхананы сынайды
function MyTestComponent() {

  // 1-ші сынақ: Жүктелу (Loading) және Сәтті (Success)
  // 3 секундтан кейін сәтті аяқталады
  const successQuery = useQuery({
    queryKey: ["successTest"],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => resolve("1. Деректер сәтті жүктелді! (Success)"), 30000);
      }),
  });

  // 2-ші сынақ: Қате (Error)
  // 5 секундтан кейін қатемен аяқталады
  const errorQuery = useQuery({
    queryKey: ["errorTest"],
    queryFn: () =>
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("2. Сервер қатесі! (Error)")), 5000);
      }),
    retry: false, // Тест үшін қайталауды өшіреміз
  });

  // 3-ші сынақ: Бос (Empty)
  // 7 секундтан кейін бос массив қайтарады
  const emptyQuery = useQuery({
    queryKey: ["emptyTest"],
    queryFn: () =>
      new Promise<string[]>((resolve) => {
        setTimeout(() => resolve([]), 7000);
      }),
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">
        Next.js 16 + @sayyyat/react-query-conditional
      </h1>

      <div className="w-full max-w-2xl flex flex-col gap-4">

        {/* Сынақ 1: Сәттілік */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Сынақ 1: Сәтті (Success)</h2>
          <Conditional query={successQuery}>
            {(results) => (
              <p className="text-green-500">{results[0].data as string}</p>
            )}
          </Conditional>
        </div>

        {/* Сынақ 2: Қате (әдепкі ErrorState қолданылады) */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Сынақ 2: Қате (Error)</h2>
          <Conditional query={errorQuery} treatErrorAsEmpty={false}>
            {/* Бұл жер ешқашан орындалмайды, себебі қате болады */}
            {() => <p>Бұл көрінбеуі керек</p>}
          </Conditional>
        </div>

        {/* Сынақ 3: Бос (әдепкі EmptyState қолданылады) */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Сынақ 3: Бос (Empty)</h2>
          <Conditional query={emptyQuery}>
            {/* Бұл жер де орындалмайды, себебі 'data' бос массив болады */}
            {() => <p>Бұл да көрінбеуі керек</p>}
          </Conditional>
        </div>

      </div>
    </main>
  );
}

export default function Home() {
  return <MyTestComponent />;
}
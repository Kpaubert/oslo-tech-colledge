'use client';

import { useChat } from 'ai/react';
import { useEffect } from 'react';

interface RecipeGPTProps {
  recipe: string;
}

export default function RecipeGPT({ recipe }: RecipeGPTProps) {
  const { messages, setInput, handleSubmit } = useChat({
    initialMessages: [
      {
        id: '-1',
        role: 'system',
        content:
          'You are a recipe assistant. You create recipes with the ingredients that the user provides. You assume the user has access to salt, pepper, water, and other standard kitchen supplies. You also assume the user has standard kitchen utensils.',
      },
    ],
  });

  useEffect(() => {
    setInput(() => recipe);
  }, [recipe]);

  return (
    <div>
      {messages.map(
        (m) =>
          m.role !== 'system' && (
            <div
              key={m.id}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {m.role}: {m.content}
            </div>
          )
      )}

      <form onSubmit={handleSubmit}>
        <button type='submit'>Ask for recipe</button>
      </form>
    </div>
  );
}

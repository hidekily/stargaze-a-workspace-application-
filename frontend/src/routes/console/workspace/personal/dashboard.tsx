import { API_URL } from '@/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/personal/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()

  const { data: dataFinanca } = useQuery({
    queryKey: ['summaryFinanca'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/financa/summary`, {
        credentials: 'include',
        method: 'GET',
      })
      return response.json()
    },
  })

  const { data: dataTodos } = useQuery({
    queryKey: ['todoSummary'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/todoList/summary`, {
        credentials: 'include',
        method: 'GET',
      })
      return response.json()
    },
  })

  const { data: dataNotas } = useQuery({
    queryKey: ['notasSummary'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/notas/summary`, {
        credentials: 'include',
        method: 'GET',
      })
      return response.json()
    },
  })

  const handleSetStatus = useMutation({
    mutationFn: async ({ itemId, doneOrNotStatus }: { itemId: string; doneOrNotStatus: string }) => {
      const response = await fetch(`${API_URL}/api/todoList/${itemId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doneOrNot: doneOrNotStatus === 'pending' ? 'done' : 'pending' }),
      })
      return response.json()
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['todoSummary'] }),
  })

  return (
    <div className="w-full h-full flex justify-center items-center">
      <section className="w-[93%] h-[95%] flex flex-col gap-3">

        <div className="h-[55%] flex gap-3">
          {/* Finanças */}
          <div className="w-[65%] h-full rounded-xl border border-zinc-800 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
              <span className="text-zinc-200 font-medium">💸 Finanças</span>
              <Link to="/console/workspace/personal/financa" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">ver todas →</Link>
            </div>
            <div className="flex-1 px-4 py-2 flex flex-col gap-1">
              <div className="flex justify-between text-sm text-zinc-500 mb-2">
                <span>Saldo do mês</span>
                <span className={dataFinanca?.saldo >= 0 ? 'text-green-400' : 'text-red-400'}>
                  R$ {Number(dataFinanca?.saldo ?? 0).toFixed(2)}
                </span>
              </div>
              {dataFinanca?.ultimas3?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-zinc-800/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.tipo === 'ganho' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-zinc-300 text-sm">{item.descricao ?? item.tipo}</span>
                  </div>
                  <span className={`text-sm font-medium ${item.tipo === 'ganho' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.tipo === 'ganho' ? '+' : '-'} R$ {Number(item.valor).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Todos */}
          <div className="w-[35%] h-full rounded-xl border border-zinc-800 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
              <span className="text-zinc-200 font-medium">📌 Todos</span>
              <Link to="/console/workspace/personal/todo" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">ver todas →</Link>
            </div>
            <div className="flex-1 px-4 py-2 flex flex-col gap-1">
              {dataTodos?.ultimas3?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-zinc-800/50 last:border-0">
                  <span className={`text-sm ${item.doneOrNot === 'done' ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>
                    {item.itemName}
                  </span>
                  <button
                    onClick={() => handleSetStatus.mutate({ itemId: item.id, doneOrNotStatus: item.doneOrNot })}
                    className={`w-5 h-5 rounded flex items-center justify-center border text-xs transition-colors
                      ${item.doneOrNot === 'done'
                        ? 'bg-yellow-400/80 border-yellow-400 text-zinc-900'
                        : 'border-zinc-700 hover:border-zinc-500'}`}
                  >
                    {item.doneOrNot === 'done' && '✓'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="h-[45%] rounded-xl border border-zinc-800 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
            <span className="text-zinc-200 font-medium">📝 Notas Recentes</span>
            <Link to="/console/workspace/personal/notas" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">ver todas →</Link>
          </div>
          <div className="flex-1 px-4 py-2 flex gap-3 overflow-x-auto">
            {dataNotas?.ultimas3?.map((nota: any) => (
              <div key={nota.id} className="min-w-55 flex-1 rounded-lg border border-zinc-800 p-3 flex flex-col gap-1 hover:border-zinc-600 transition-colors cursor-default">
                <span className="text-zinc-200 text-sm font-medium truncate">{nota.notasName}</span>
                <p className="text-zinc-500 text-xs line-clamp-3">{nota.preview || 'Sem conteúdo'}</p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  )
}

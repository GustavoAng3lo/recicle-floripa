import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Award, ChevronRight, Settings } from 'lucide-react';
import logoRecicle from '../assets/png.png';

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const loginDataRaw = localStorage.getItem("loginData");
      
      if (!loginDataRaw) {
        navigate('/login');
        return;
      }

      const loginData = JSON.parse(loginDataRaw);
      const userId = loginData?.user?.id;

      if (!userId) {
        console.error("ID do usuário não encontrado.");
        setLoading(false);
        return;
      }

      // Requisições paralelas para maior velocidade
      const [resUser, resHistory] = await Promise.all([
        axios.get(`http://localhost:3000/usuarios/${userId}`),
        axios.get(`http://localhost:3000/residuos/${userId}`)
      ]);

      setProfile(resUser.data);
      setHistory(resHistory.data);
    } catch (error) {
      console.error("Erro ao carregar dados da Home:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteColeta = async (coletaId) => {
    if (window.confirm("Deseja realmente excluir este registro de descarte?")) {
      try {
        await axios.delete(`http://localhost:3000/residuos/${coletaId}`);
        alert("✅ Registro excluído com sucesso!");
        setHistory(history.filter(item => item.id !== coletaId));
      } catch (error) {
        console.error("Erro ao deletar registro:", error);
        alert("❌ Não foi possível deletar o registro.");
      }
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Carregando painel...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Exibição segura do perfil */}
      {profile && (
        <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold">Olá, {profile.nome || "Usuário"}!</h1>
          <p className="text-emerald-100 mt-1">Bem-vindo ao painel do Recicle Floripa.</p>
          <div className="mt-4 bg-white/20 inline-block px-4 py-2 rounded-xl">
            <span className="text-xs uppercase font-semibold tracking-wider block opacity-75">Pontuação Acumulada</span>
            <span className="text-3xl font-extrabold">{profile.pontos || 0} pts</span>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Seu Histórico de Coletas</h2>
        
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum descarte registrado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600 font-semibold text-sm">
                  <th className="pb-3">Material</th>
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3 text-center">Qtd</th>
                  <th className="pb-3">Localização</th>
                  <th className="pb-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-3 capitalize font-medium">{item.categoria}</td>
                    <td className="py-3 capitalize">{item.tipo_reciclagem}</td>
                    <td className="py-3 text-center">{item.quantidade}</td>
                    <td className="py-3">{item.localizacao || "Não informada"}</td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => handleDeleteColeta(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-lg text-xs transition"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
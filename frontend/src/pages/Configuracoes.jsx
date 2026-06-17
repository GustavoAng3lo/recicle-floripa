import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Configuracoes() {
  const [user, setUser] = useState({ nome: "", email: "", cpf: "" });
  
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  const userId = loginData?.user?.id;

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:3000/usuarios/${userId}`)
      .then(res => setUser({ nome: res.data.nome, email: res.data.email, cpf: res.data.cpf || "" }))
      .catch(err => console.error("Erro ao buscar dados do perfil:", err));
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/usuarios/${userId}`, {
        nome: user.nome,
        email: user.email,
        cpf: user.cpf
      });
      
      // Sincroniza o novo nome no localStorage para atualizar os cabeçalhos do site
      if (loginData) {
        loginData.user.nome = user.nome;
        loginData.user.email = user.email;
        localStorage.setItem("loginData", JSON.stringify(loginData));
      }

      alert("✅ Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("❌ Falha ao atualizar dados.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Configurações da Conta</h2>
      <p className="text-gray-500 text-sm mb-6">Mantenha os dados do seu perfil atualizados.</p>
      
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
          <input
            type="text"
            value={user.nome}
            onChange={(e) => setUser({ ...user, nome: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">CPF</label>
          <input
            type="text"
            value={user.cpf}
            onChange={(e) => setUser({ ...user, cpf: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="000.000.000-00"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition mt-2 shadow-sm"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
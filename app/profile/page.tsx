"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Importe do Firebase Storage
import { auth, storage } from "@/lib/firebase/config"; // Importe 'storage' também
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MdPerson, MdEmail, MdEdit, MdDelete, MdHelp, MdArrowBack, MdSave, MdCancel, MdUpload } from "react-icons/md"; // Adicione MdUpload

// Interface para um erro mais tipado do Firebase
interface FirebaseAuthError extends Error {
  code?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false); // Novo estado para upload de foto

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setName(user.displayName || "");
        setPhotoURL(user.photoURL || "");
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]); // `router` na dependência para consistência

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    setError(null);
    setSuccess(null);

    try {
      await updateProfile(currentUser, {
        displayName: name,
        photoURL: photoURL || null, // Se photoURL for vazio, set null para remover
      });
      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
      setIsEditing(false);
    } catch (err: unknown) { // Use 'unknown' para tipagem segura
      console.error("Error updating profile:", err);
      const error = err as FirebaseAuthError; // Type assertion para FirebaseAuthError

      if (error && error.code) {
        switch (error.code) {
          case 'auth/invalid-photo-url':
            setError("URL da foto inválida. Por favor, insira uma URL de imagem válida.");
            break;
          // Adicione outros casos de erro do Firebase se necessário
          default:
            setError("Erro ao atualizar perfil. Tente novamente.");
            break;
        }
      } else {
        setError("Erro desconhecido ao atualizar perfil.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser || !currentPassword) {
      setError("Por favor, forneça sua senha atual para confirmar.");
      return;
    }
    setError(null);

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email || "", // assume que email sempre estará presente para reautenticação
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await deleteUser(currentUser);
      setSuccess("Conta excluída com sucesso! Redirecionando...");
      router.push("/");
    } catch (err: unknown) {
      console.error("Error deleting account:", err);
      const error = err as FirebaseAuthError;

      if (error && error.code) {
        switch (error.code) {
          case 'auth/wrong-password':
            setError("Senha incorreta. Por favor, tente novamente.");
            break;
          case 'auth/requires-recent-login':
            setError("Esta ação requer um login recente. Por favor, faça login novamente e tente de novo.");
            // Opcional: router.push("/login"); // Força o usuário a fazer login novamente
            break;
          case 'auth/user-mismatch':
            setError("Credenciais inválidas. Verifique o usuário logado.");
            break;
          default:
            setError("Erro ao deletar conta. Tente novamente.");
            break;
        }
      } else {
        setError("Erro desconhecido ao deletar conta.");
      }
    } finally {
      setIsDeleting(false);
      setCurrentPassword("");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      setError(null);
      setIsUploadingPhoto(true); // Ativa o estado de upload

      try {
        const storageRef = ref(storage, `profile_pictures/${currentUser.uid}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        setPhotoURL(downloadURL); // Atualiza o estado local com a URL do Storage
        setSuccess("Foto carregada. Clique em 'Salvar' para aplicar a mudança.");
        setTimeout(() => setSuccess(null), 3000);

      } catch (err: unknown) {
        console.error("Error uploading photo:", err);
        const error = err as Error; // Apenas Error porque pode não ser do Firebase auth

        if (error.message.includes('permission-denied')) {
            setError("Permissão negada. Verifique as regras de segurança do Firebase Storage.");
        } else {
            setError("Erro ao carregar a foto. Tente novamente.");
        }
      } finally {
        setIsUploadingPhoto(false); // Desativa o estado de upload
      }
    }
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:suporte@nutrana.com?subject=Suporte Nutrana";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
          ></motion.div>
          <p className="text-gray-600 text-lg font-medium">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Se não há currentUser e não está mais carregando, redirecione.
  // A verificação dentro do useEffect já fará o router.push.
  // Este bloco é mais um safety net para o caso de um estado intermediário.
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 text-gray-800 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto backdrop-blur-sm bg-white/70 rounded-3xl shadow-2xl p-6 md:p-8 my-8 border border-white/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="p-3 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <MdArrowBack className="text-xl" />
          </motion.button>
          <h1 className="text-3xl font-extrabold text-gray-900">Meu Perfil</h1>
          {/* Removido o spacer vazio, o justify-between é suficiente */}
          <div className="w-10 h-10 opacity-0" aria-hidden="true"></div> {/* Um placeholder invisível para manter o espaçamento simétrico, se necessário */}
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-emerald-400 mb-4 shadow-md">
              <Image
                src={photoURL || "/user-default.png"}
                alt={name || "Usuário"}
                width={144}
                height={144}
                className="object-cover w-full h-full"
                priority
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer group">
                  <label className="text-white flex flex-col items-center cursor-pointer">
                    {isUploadingPhoto ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                      ></motion.div>
                    ) : (
                      <MdUpload className="text-3xl transition-transform group-hover:scale-110" />
                    )}
                    <span className="text-xs mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {isUploadingPhoto ? "Carregando..." : "Mudar Foto"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto} // Desabilita durante o upload
                    />
                  </label>
                </div>
              )}
            </div>

            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold text-center border-b-2 border-emerald-400 focus:border-emerald-600 outline-none mb-4 px-3 py-2 rounded-md transition-colors duration-200"
                placeholder="Seu nome"
                aria-label="Nome do usuário"
              />
            ) : (
              <h2 className="text-2xl font-bold text-center mb-3 text-gray-900">{name || "Nome não definido"}</h2>
            )}

            <div className="flex items-center text-gray-600 text-lg">
              <MdEmail className="mr-2 text-xl text-gray-500" />
              <span>{currentUser.email}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit-buttons"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center gap-4 mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsEditing(false);
                    // Resetar nome e foto para o estado atual do usuário se cancelar
                    setName(currentUser.displayName || "");
                    setPhotoURL(currentUser.photoURL || "");
                    setError(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center"
                >
                  <MdCancel className="mr-2" /> Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdateProfile}
                  disabled={isUploadingPhoto} // Desabilita salvar enquanto a foto está carregando
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md focus:outline-none focus:ring-2 flex items-center justify-center
                    ${isUploadingPhoto ? 'bg-emerald-300 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400'}`}
                >
                  <MdSave className="mr-2" /> Salvar
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                key="edit-profile-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(true)}
                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 mt-6"
              >
                <MdEdit className="mr-2 text-xl" />
                Editar Perfil
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Actions Section */}
        <div className="space-y-4">
          {/* Delete Account */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <button
              onClick={() => {
                setIsDeleting(!isDeleting);
                setError(null); // Limpa erros ao abrir/fechar
                setCurrentPassword(""); // Limpa a senha ao abrir/fechar
              }}
              className="w-full p-5 flex items-center justify-between hover:bg-red-50 transition-colors duration-200"
              aria-expanded={isDeleting}
              aria-controls="delete-account-form"
            >
              <div className="flex items-center text-red-600">
                <MdDelete className="mr-4 text-2xl" />
                <span className="font-semibold text-lg">Excluir Conta</span>
              </div>
              <motion.span
                animate={{ rotate: isDeleting ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400 text-xl"
              >
                &#9660;
              </motion.span>
            </button>

            <AnimatePresence>
              {isDeleting && (
                <motion.div
                  id="delete-account-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="px-6 pb-6"
                >
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.
                  </p>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha para confirmar"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors duration-200 outline-none"
                    aria-label="Digite sua senha para confirmar exclusão"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsDeleting(false);
                        setCurrentPassword("");
                        setError(null);
                      }}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDeleteAccount}
                      className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      Confirmar Exclusão
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100"
          >
            <button
              onClick={handleContactSupport}
              className="w-full p-5 flex items-center hover:bg-teal-50 transition-colors duration-200"
            >
              <MdHelp className="mr-4 text-2xl text-teal-600" />
              <span className="font-semibold text-lg">Fale Conosco / Suporte</span>
            </button>
          </motion.div>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 flex items-center"
              role="alert" // Para acessibilidade
            >
              <span className="mr-3 text-2xl">🚨</span> {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200 flex items-center"
              role="status" // Para acessibilidade
            >
              <span className="mr-3 text-2xl">✅</span> {success}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
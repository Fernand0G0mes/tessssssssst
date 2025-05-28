"use client";

import { useState, useEffect, ComponentType, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth"; // Adicionado updatePassword
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/lib/firebase/config"; // Certifique-se que este caminho está correto
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdPerson, MdEmail, MdEdit, MdDelete, MdHelp, MdArrowBack, MdSave, MdCancel, MdUpload,
  MdKeyboardArrowDown, MdErrorOutline, MdCheckCircleOutline,
  MdLock, MdNotifications, MdSettings, MdAccountCircle, MdCreditCard, MdFileDownload, MdShield,
  MdDevices, MdVisibility, MdVisibilityOff, MdVpnKey, MdSms, MdQrCodeScanner, MdLogout
} from "react-icons/md";

interface FirebaseAuthError extends Error {
  code?: string;
}

interface TabProps {
  currentUser: User;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

interface ProfileInfoTabProps extends TabProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  name: string;
  setName: (name: string) => void;
  photoURL: string;
  setPhotoURL: (photoURL: string) => void;
  isUploadingPhoto: boolean;
  setIsUploadingPhoto: (isUploadingPhoto: boolean) => void;
  handleUpdateProfile: () => Promise<void>;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

interface AccountTabProps extends TabProps {
  currentPasswordForDelete: string;
  setCurrentPasswordForDelete: (password: string) => void;
  isDeletingAccount: boolean;
  setIsDeletingAccount: (isDeleting: boolean) => void;
  handleDeleteAccount: () => Promise<void>;
}

// --- ABA: INFORMAÇÕES DO PERFIL ---
const ProfileInfoTab: ComponentType<ProfileInfoTabProps> = ({
  currentUser, isEditing, setIsEditing, name, setName, photoURL, setPhotoURL,
  isUploadingPhoto, handleUpdateProfile, handlePhotoUpload,
  setError, setSuccess
}) => {
  return (
    <motion.div
      key="profileInfoTab"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/80">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-emerald-500 mb-5 shadow-lg group">
            <Image
              src={photoURL || "/user-default.png"} // Garanta que tem /user-default.png em public/
              alt={name || "Foto do Usuário"}
              width={144} height={144}
              className="object-cover w-full h-full" priority
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <label className="text-white flex flex-col items-center cursor-pointer p-2 rounded-md hover:bg-black/30">
                  {isUploadingPhoto ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-7 h-7 border-4 border-white border-t-transparent rounded-full"></motion.div>
                  ) : (
                    <MdUpload className="text-3xl md:text-4xl transition-transform group-hover:scale-110" />
                  )}
                  <span className="text-xs md:text-sm mt-1 font-medium">
                    {isUploadingPhoto ? "Enviando..." : "Mudar Foto"}
                  </span>
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handlePhotoUpload} disabled={isUploadingPhoto} />
                </label>
              </div>
            )}
          </div>
          {isEditing ? (
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full max-w-xs text-2xl font-bold text-center bg-gray-50 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 outline-none mb-2 px-4 py-2.5 rounded-lg transition-all duration-200 placeholder-gray-400"
              placeholder="Seu nome" aria-label="Nome do usuário"
            />
          ) : (
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-800 break-words max-w-full px-2">
              {name || "Nome não informado"}
            </h2>
          )}
          <div className="flex items-center text-gray-600 text-base md:text-lg">
            <MdEmail className="mr-2 text-xl text-gray-500" />
            <span>{currentUser.email}</span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div key="edit-buttons" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
              <motion.button whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }} whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setIsEditing(false);
                  setName(currentUser.displayName || "");
                  setPhotoURL(currentUser.photoURL || "");
                  setError(null); setSuccess(null);
                }}
                className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 flex items-center justify-center">
                <MdCancel className="mr-2 text-lg" /> Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(16, 185, 129, 0.3)" }} whileTap={{ scale: 0.97 }}
                onClick={handleUpdateProfile} disabled={isUploadingPhoto}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 flex items-center justify-center ${isUploadingPhoto ? 'bg-emerald-300 text-white cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400'}`}>
                <MdSave className="mr-2 text-lg" /> Salvar Alterações
              </motion.button>
            </motion.div>
          ) : (
            <motion.button key="edit-profile-button" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.02, y: -2, boxShadow: "0px 8px 20px rgba(16, 185, 129, 0.35)"}} whileTap={{ scale: 0.98, y: 0 }}
              onClick={() => setIsEditing(true)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-semibold flex items-center justify-center shadow-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 mt-6">
              <MdEdit className="mr-2 text-xl" /> Editar Perfil
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200/70 hover:shadow-xl transition-shadow mt-6"
      >
        <button
          onClick={() => window.location.href = "mailto:suporte@nutrana.com?subject=Suporte%20Nutrana"} // Coloque seu email de suporte
          className="w-full p-5 flex items-center text-gray-700 hover:bg-emerald-50/70 transition-colors duration-200 group rounded-xl"
        >
          <MdHelp className="mr-3.5 text-2xl text-emerald-600 group-hover:text-emerald-700 group-hover:scale-105 transition-all" />
          <span className="font-semibold text-base md:text-lg text-gray-800 group-hover:text-emerald-700 transition-colors">Fale Conosco / Suporte</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

// --- ABA: SEGURANÇA ---
const SecurityTab: ComponentType<TabProps> = ({ currentUser, setError, setSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showing2FASetup, setShowing2FASetup] = useState(false);
  const [selected2FAMethod, setSelected2FAMethod] = useState<'app' | 'sms' | null>(null);
  const [twoFACode, setTwoFACode] = useState('');

  interface ActiveSession {
    id: string;
    device: string;
    location: string;
    lastAccess: string;
    current: boolean;
    icon: ReactNode;
  }
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    { id: '1', device: 'Chrome em Windows 11', location: 'Vigo, Espanha (Sessão atual)', lastAccess: 'Agora mesmo', current: true, icon: <MdDevices className="text-blue-500" /> },
    { id: '2', device: 'iPhone (App Nutrana v1.2)', location: 'Porto, Portugal', lastAccess: 'Ontem às 20:15', current: false, icon: <MdDevices className="text-gray-500" /> },
    { id: '3', device: 'Firefox em Ubuntu Linux', location: 'Madrid, Espanha', lastAccess: '25 de Maio, 2025', current: false, icon: <MdDevices className="text-orange-500" /> },
  ]);

  const handleChangePassword = async () => {
    setError(null); setSuccess(null);
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Todos os campos de senha são obrigatórios."); return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("As novas senhas não coincidem."); return;
    }
    if (newPassword.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres."); return;
    }
    setIsChangingPassword(true);
    try {
      if (!currentUser || !currentUser.email) {
        setError("Utilizador não encontrado ou email em falta.");
        setIsChangingPassword(false);
        return;
      }
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword); // Função importada do Firebase Auth
      setSuccess("Senha alterada com sucesso!");
      setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
    } catch (err) {
      const firebaseError = err as FirebaseAuthError;
      if (firebaseError.code === 'auth/wrong-password') setError("A senha atual está incorreta.");
      else if (firebaseError.code === 'auth/weak-password') setError("A nova senha é muito fraca. Tente uma mais forte.");
      else if (firebaseError.code === 'auth/requires-recent-login') setError("Esta operação é sensível e requer autenticação recente. Faça login novamente e tente de novo.");
      else setError("Erro ao alterar senha. Verifique os dados e tente novamente.");
      console.error("Erro ao alterar senha:", firebaseError);
    }
    setIsChangingPassword(false);
  };

  const handleToggle2FA = () => {
    if (is2FAEnabled) {
      // Simular desativação (na prática, chame o backend)
      setIs2FAEnabled(false); setShowing2FASetup(false); setSelected2FAMethod(null);
      setSuccess("Autenticação de Dois Fatores desativada. (Simulação)");
    } else {
      setShowing2FASetup(true);
    }
  };

  const handleSelect2FAMethod = (method: 'app' | 'sms') => {
    setSelected2FAMethod(method);
    setSuccess(`Método ${method === 'app' ? 'App Autenticadora' : 'SMS'} selecionado. Siga os passos.`);
  };

  const handleConfirm2FASetup = () => {
    // SIMULAÇÃO: Validar o twoFACode e finalizar com backend
    console.log("Simulando confirmação de código 2FA:", twoFACode);
    setIs2FAEnabled(true); setShowing2FASetup(false);
    setSuccess(`2FA ativado com ${selected2FAMethod === 'app' ? 'App Autenticadora' : 'SMS'}! (Simulação)`);
    setTwoFACode('');
    // IMPORTANTE: Gerar e mostrar códigos de recuperação!
  };

  const handleTerminateSession = (sessionId: string) => {
    // SIMULAÇÃO: Chamar backend para invalidar a sessão
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    setSuccess(`Sessão ${sessionId} terminada. (Simulação)`);
  };

  const handleTerminateAllOtherSessions = () => {
    // SIMULAÇÃO: Chamar backend para invalidar todas as outras sessões
    setActiveSessions(prev => prev.filter(session => session.current));
    setSuccess("Todas as outras sessões foram terminadas. (Simulação)");
  };

  const inputGroupClass = "relative";
  const inputClass = "w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-colors text-sm";
  const eyeButtonClass = "absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500 hover:text-emerald-600";

  return (
    <motion.div
      key="securityTabContent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <section className="p-6 bg-white rounded-xl shadow-xl border border-gray-200/80">
        <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center"><MdLock className="mr-2.5 text-2xl text-emerald-600" />Alterar Senha</h3>
        <p className="text-sm text-gray-600 mb-5">Use uma senha forte e única.</p>
        <div className="space-y-4">
          <div className={inputGroupClass}>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currentPasswordSec">Senha Atual</label>
            <input type={showCurrentPassword ? "text" : "password"} id="currentPasswordSec" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className={eyeButtonClass}>{showCurrentPassword ? <MdVisibilityOff /> : <MdVisibility />}</button>
          </div>
          <div className={inputGroupClass}>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="newPasswordSec">Nova Senha</label>
            <input type={showNewPassword ? "text" : "password"} id="newPasswordSec" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="Mínimo 8 caracteres" />
            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className={eyeButtonClass}>{showNewPassword ? <MdVisibilityOff /> : <MdVisibility />}</button>
          </div>
          <div className={inputGroupClass}>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmNewPasswordSec">Confirmar Nova Senha</label>
            <input type={showConfirmNewPassword ? "text" : "password"} id="confirmNewPasswordSec" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={inputClass} placeholder="Repita a nova senha" />
            <button type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className={eyeButtonClass}>{showConfirmNewPassword ? <MdVisibilityOff /> : <MdVisibility />}</button>
          </div>
          <button onClick={handleChangePassword} disabled={isChangingPassword} className="w-full sm:w-auto px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-400 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
            {isChangingPassword ? (<motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}></motion.div>) : (<MdSave className="mr-2" />)}
            {isChangingPassword ? "A Alterar..." : "Alterar Senha"}
          </button>
        </div>
      </section>

      <section className="p-6 bg-white rounded-xl shadow-xl border border-gray-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800 mb-1 sm:mb-0 flex items-center"><MdShield className="mr-2.5 text-2xl text-emerald-600" />Autenticação de Dois Fatores (2FA)</h3>
          <button onClick={handleToggle2FA} className={`px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm flex items-center shadow-sm hover:shadow-md ${is2FAEnabled ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
            {is2FAEnabled ? <MdLogout className="mr-1.5" /> : <MdVpnKey className="mr-1.5" />}{is2FAEnabled ? 'Desativar 2FA' : 'Ativar 2FA'}
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">{is2FAEnabled ? `2FA está ativo${selected2FAMethod ? ` com ${selected2FAMethod === 'app' ? 'App Autenticadora' : 'SMS'}` : ''}.` : 'Adicione uma camada extra de segurança.'}</p>
        <AnimatePresence>
        {showing2FASetup && !is2FAEnabled && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5 pt-5 border-t border-gray-200 space-y-4">
            {!selected2FAMethod ? (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Escolha um método:</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => handleSelect2FAMethod('app')} className="flex-1 p-4 border border-gray-300 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-colors flex items-center text-left"><MdQrCodeScanner className="text-3xl text-emerald-600 mr-3 shrink-0" /><div><span className="font-semibold text-gray-700">App Autenticadora</span><p className="text-xs text-gray-500">Use códigos de apps (Recomendado)</p></div></button>
                  <button onClick={() => handleSelect2FAMethod('sms')} className="flex-1 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center text-left"><MdSms className="text-3xl text-blue-600 mr-3 shrink-0" /><div><span className="font-semibold text-gray-700">Mensagem SMS</span><p className="text-xs text-gray-500">Receba códigos por SMS.</p></div></button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {selected2FAMethod === 'app' && (<div><p className="text-sm text-gray-700">1. Instale uma app autenticadora.</p><p className="text-sm text-gray-700">2. Leia este QR Code:</p><div className="my-3 p-4 bg-gray-100 rounded-lg inline-block"><div className="w-32 h-32 bg-gray-300 flex items-center justify-center text-xs text-gray-500">QR Code Aqui</div></div><p className="text-sm text-gray-700">Ou insira a chave: <span className="font-mono bg-gray-100 p-1 rounded">ABCD EFGH IJKL MNOP</span></p></div>)}
                {selected2FAMethod === 'sms' && (<div><label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber2FA">Número de Telemóvel</label><input type="tel" id="phoneNumber2FA" className={inputClass + " mb-2"} placeholder="+351 XXX XXX XXX" /><button className="text-sm text-emerald-600 hover:underline">Enviar código</button></div>)}
                <div><label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="twoFACode">Código de Verificação</label><input type="text" id="twoFACode" value={twoFACode} onChange={(e) => setTwoFACode(e.target.value)} className={inputClass} placeholder="Código de 6 dígitos" maxLength={6} /></div>
                <div className="flex gap-3"><button onClick={handleConfirm2FASetup} className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors shadow-md">Confirmar</button><button onClick={() => { setSelected2FAMethod(null); setTwoFACode(''); }} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">Voltar</button></div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-4">Após ativar, guarde os seus códigos de recuperação em local seguro.</p>
          </motion.div>
        )}
        </AnimatePresence>
      </section>

      <section className="p-6 bg-white rounded-xl shadow-xl border border-gray-200/80">
        <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center"><MdDevices className="mr-2.5 text-2xl text-emerald-600" />Sessões Ativas</h3>
        <p className="text-sm text-gray-600 mb-5">Sessões onde a sua conta está conectada.</p>
        <div className="space-y-3">
          {activeSessions.map(session => (
            <div key={session.id} className="p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50/50">
              <div className="flex items-center"><div className="mr-3 text-2xl shrink-0">{session.icon}</div><div><p className="font-medium text-gray-800 text-sm">{session.device}</p><p className="text-xs text-gray-500">{session.location} - <span className="italic">{session.lastAccess}</span></p></div></div>
              {!session.current ? (<button onClick={() => handleTerminateSession(session.id)} className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-semibold rounded-md hover:bg-red-200 transition-colors self-start sm:self-center">Terminar</button>) : (<span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-md self-start sm:self-center">Sessão Atual</span>)}
            </div>
          ))}
        </div>
        {activeSessions.filter(s => !s.current).length > 0 && (<button onClick={handleTerminateAllOtherSessions} className="mt-5 px-5 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500">Terminar Outras Sessões</button>)}
      </section>
    </motion.div>
  );
};

// --- ABA: PREFERÊNCIAS ---
const PreferencesTab: ComponentType<TabProps> = ({ currentUser, setError, setSuccess }) => {
  // Estados para preferências (exemplos)
  const [receivePromoEmails, setReceivePromoEmails] = useState(true);
  const [activityNotifications, setActivityNotifications] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('system');

  const ToggleSwitch = ({ enabled, setEnabled }: { enabled: boolean, setEnabled: (val: boolean) => void }) => (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
    >
      <motion.div layout className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <motion.div
      key="preferencesTabContent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <section className="p-6 bg-white rounded-xl shadow-xl border border-gray-200/80">
        <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center"><MdNotifications className="mr-2.5 text-2xl text-emerald-600" />Notificações</h3>
        <p className="text-sm text-gray-600 mb-5">Escolha como quer ser notificado.</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-700">Receber emails promocionais</span>
            <ToggleSwitch enabled={receivePromoEmails} setEnabled={setReceivePromoEmails} />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-700">Notificações de atividade na app</span>
            <ToggleSwitch enabled={activityNotifications} setEnabled={setActivityNotifications} />
          </div>
        </div>
      </section>

      <section className="p-6 bg-white rounded-xl shadow-xl border border-gray-200/80">
        <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center"><MdSettings className="mr-2.5 text-2xl text-emerald-600" />Tema da Interface</h3>
        <p className="text-sm text-gray-600 mb-5">Selecione o seu tema preferido.</p>
        <div className="flex flex-wrap gap-3">
          {(['light', 'dark', 'system'] as const).map(theme => (
            <button
              key={theme} onClick={() => setSelectedTheme(theme)}
              className={`px-5 py-2.5 rounded-lg font-medium border transition-colors text-sm
                          ${selectedTheme === theme ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:text-emerald-600'}`}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="p-6 bg-white rounded-xl shadow-xl border border-gray-200/80">
        <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center"><MdPerson className="mr-2.5 text-2xl text-emerald-600" />Preferências Nutricionais (Nutrana)</h3>
        <p className="text-sm text-gray-600 mb-5">Personalize a sua experiência na Nutrana.</p>
        <div className="space-y-4">
          <div>
            <label htmlFor="dietRestrictions" className="block text-sm font-medium text-gray-700 mb-1">Restrições Alimentares</label>
            <input type="text" id="dietRestrictions" placeholder="Ex: Sem glúten, vegetariano" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none text-sm"/>
          </div>
          <div>
            <label htmlFor="healthGoals" className="block text-sm font-medium text-gray-700 mb-1">Objetivos de Saúde</label>
            <input type="text" id="healthGoals" placeholder="Ex: Perder peso, mais energia" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none text-sm"/>
          </div>
          {/* Adicione mais campos conforme necessário */}
          <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors shadow-md text-sm">Guardar Preferências Nutricionais</button>
        </div>
      </section>
    </motion.div>
  );
};

// --- ABA: CONTA ---
const AccountTab: ComponentType<AccountTabProps> = ({
  currentUser, currentPasswordForDelete, setCurrentPasswordForDelete,
  isDeletingAccount, setIsDeletingAccount, handleDeleteAccount,
  setError, setSuccess
}) => {
  return (
    <motion.div
      key="accountTabContent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <section className="p-6 bg-white rounded-xl shadow-xl border border-gray-200/80">
        <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center"><MdCreditCard className="mr-2.5 text-2xl text-emerald-600" />Subscrição (Exemplo)</h3>
        <p className="text-sm text-gray-600 mb-5">Plano Atual: <span className="font-semibold text-emerald-600">Premium</span> (Isto é um exemplo)</p>
        <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors shadow-md text-sm">Gerir Subscrição</button>
      </section>

      <section className="p-6 bg-white rounded-xl shadow-xl border border-gray-200/80">
        <h3 className="text-xl font-semibold text-gray-800 mb-1 flex items-center"><MdFileDownload className="mr-2.5 text-2xl text-emerald-600" />Descarregar Seus Dados</h3>
        <p className="text-sm text-gray-600 mb-5">Pode solicitar um ficheiro com os seus dados pessoais (RGPD/LGPD).</p>
        <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm shadow-sm">Solicitar Dados</button>
      </section>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-red-300">
        <button
          onClick={() => { setIsDeletingAccount(!isDeletingAccount); setError(null); setCurrentPasswordForDelete(""); }}
          className="w-full p-5 flex items-center justify-between hover:bg-red-50/70 transition-colors duration-200 group"
          aria-expanded={isDeletingAccount}
        >
          <div className="flex items-center text-red-600">
            <MdDelete className="mr-3.5 text-2xl group-hover:scale-105 transition-transform" />
            <span className="font-semibold text-base md:text-lg">Excluir Conta Permanentemente</span>
          </div>
          <MdKeyboardArrowDown className={`text-gray-500 text-2xl transform transition-transform duration-300 ${isDeletingAccount ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isDeletingAccount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }} className="px-5 md:px-6 pb-6 border-t border-red-200 bg-red-50/30"
            >
              <p className="text-sm text-red-800 my-4 leading-relaxed font-medium">
                Tem a certeza absoluta? Esta ação é <strong>irreversível</strong> e todos os seus dados Nutrana serão permanentemente perdidos.
              </p>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currentPasswordDel">Digite sua senha para confirmar</label>
                <input
                  type="password" id="currentPasswordDel" value={currentPasswordForDelete}
                  onChange={(e) => setCurrentPasswordForDelete(e.target.value)}
                  placeholder="Sua senha atual"
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setIsDeletingAccount(false); setCurrentPasswordForDelete(""); setError(null); }}
                  className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1">
                  Cancelar
                </motion.button>
                <motion.button whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(220, 38, 38, 0.3)"}} whileTap={{ scale: 0.97 }}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1">
                  Sim, Excluir Minha Conta
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA DE PERFIL ---
export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [currentPasswordForDelete, setCurrentPasswordForDelete] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [activeTab, setActiveTab] = useState<string>("perfil");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setName(user.displayName || "");
        setPhotoURL(user.photoURL || "");
      } else {
        router.push("/login"); // Adapte para a sua rota de login
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    setError(null); setSuccess(null);
    try {
      await updateProfile(currentUser, { displayName: name, photoURL: photoURL || null });
      setCurrentUser(prevUser => prevUser ? { ...prevUser, displayName: name, photoURL: photoURL } : null);
      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
      setIsEditing(false);
    } catch (err) {
      const firebaseError = err as FirebaseAuthError;
      if (firebaseError?.code === 'auth/invalid-photo-url') setError("URL da foto inválida.");
      else if (firebaseError?.code === 'auth/requires-recent-login') setError("Esta operação requer login recente. Faça login de novo.");
      else setError("Erro ao atualizar perfil.");
      console.error("Error updating profile:", firebaseError);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      setError(null); setSuccess(null); setIsUploadingPhoto(true);
      try {
        const storageRefInstance = ref(storage, `profile_pictures/${currentUser.uid}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRefInstance, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setPhotoURL(downloadURL);
        setSuccess("Foto carregada. Clique em 'Salvar' para aplicar.");
        setTimeout(() => setSuccess(null), 3500);
      } catch (err) {
        setError("Erro ao carregar a foto."); console.error("Error uploading photo:", err);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser || !currentPasswordForDelete) {
      setError("Por favor, forneça sua senha atual para confirmar a exclusão."); return;
    }
    setError(null);
    try {
      if (!currentUser.email) { setError("Email do utilizador não encontrado."); return; }
      const credential = EmailAuthProvider.credential(currentUser.email, currentPasswordForDelete);
      await reauthenticateWithCredential(currentUser, credential);
      await deleteUser(currentUser);
      setSuccess("Conta excluída com sucesso! A redirecionar...");
      setTimeout(() => router.push("/"), 3000); // Adapte para a sua rota principal
    } catch (err) {
      const firebaseError = err as FirebaseAuthError;
      if (firebaseError.code === 'auth/wrong-password') setError("Senha incorreta. Verifique e tente novamente.");
      else if (firebaseError.code === 'auth/requires-recent-login') setError("Esta operação é sensível e requer autenticação recente. Por favor, faça login novamente e tente de novo.");
      else setError("Erro ao deletar conta. Tente novamente.");
      console.error("Error deleting account:", firebaseError);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-orange-100">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-6"></motion.div>
          <p className="text-gray-700 text-xl font-medium">A carregar o seu perfil...</p>
        </div>
      </div>
    );
  }
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-orange-100">
        <p className="text-gray-700 text-xl font-medium">Utilizador não autenticado. A redirecionar...</p>
      </div>
    );
  }

  const TabButton = ({ label, tabName, icon: Icon }: { label: string; tabName: string; icon: ComponentType<{className?:string}> }) => (
    <button
      onClick={() => { setActiveTab(tabName); setError(null); setSuccess(null); }}
      className={`flex items-center space-x-2 px-3 py-3 md:px-4 font-medium text-sm md:text-base leading-5 rounded-t-lg focus:outline-none transition-all duration-200 ease-in-out group whitespace-nowrap ${activeTab === tabName ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-emerald-500 hover:border-b-2 hover:border-gray-300'}`}
      role="tab" aria-selected={activeTab === tabName}
    >
      <Icon className={`text-xl transition-colors duration-200 ${activeTab === tabName ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'}`} />
      <span>{label}</span>
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "perfil": return <ProfileInfoTab currentUser={currentUser} isEditing={isEditing} setIsEditing={setIsEditing} name={name} setName={setName} photoURL={photoURL} setPhotoURL={setPhotoURL} isUploadingPhoto={isUploadingPhoto} setIsUploadingPhoto={setIsUploadingPhoto} handleUpdateProfile={handleUpdateProfile} handlePhotoUpload={handlePhotoUpload} setError={setError} setSuccess={setSuccess} />;
      case "seguranca": return <SecurityTab currentUser={currentUser} setError={setError} setSuccess={setSuccess} />;
      case "preferencias": return <PreferencesTab currentUser={currentUser} setError={setError} setSuccess={setSuccess} />;
      case "conta": return <AccountTab currentUser={currentUser} currentPasswordForDelete={currentPasswordForDelete} setCurrentPasswordForDelete={setCurrentPasswordForDelete} isDeletingAccount={isDeletingAccount} setIsDeletingAccount={setIsDeletingAccount} handleDeleteAccount={handleDeleteAccount} setError={setError} setSuccess={setSuccess} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-orange-50 text-gray-800 p-4 md:py-8 md:px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center justify-center mb-6 md:mb-8">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => router.back()} className="absolute left-0 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/70 backdrop-blur-sm shadow-md text-gray-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2" aria-label="Voltar">
            <MdArrowBack className="text-xl text-emerald-600" />
          </motion.button>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 tracking-tight py-1">
            O Meu Perfil
          </h1>
        </div>

        <div className="mb-6 md:mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-1 sm:space-x-2 md:space-x-3 overflow-x-auto pb-px" aria-label="Tabs">
            <TabButton label="Perfil" tabName="perfil" icon={MdPerson} />
            <TabButton label="Segurança" tabName="seguranca" icon={MdLock} />
            <TabButton label="Preferências" tabName="preferencias" icon={MdSettings} />
            <TabButton label="Conta" tabName="conta" icon={MdAccountCircle} />
          </nav>
        </div>

        <div className="min-h-[3rem] mb-4"> {/* Espaço reservado para mensagens, ajustado min-h */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: {duration: 0.2} }} transition={{ duration: 0.3 }} className="p-3.5 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-600 shadow-md flex items-center text-sm" role="alert">
                <MdErrorOutline className="mr-2.5 text-xl text-red-600 shrink-0" /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: {duration: 0.2} }} transition={{ duration: 0.3 }} className="p-3.5 bg-green-100 text-green-700 rounded-lg border-l-4 border-green-600 shadow-md flex items-center text-sm" role="status">
                <MdCheckCircleOutline className="mr-2.5 text-xl text-green-600 shrink-0" /> {success}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* O container das abas agora não precisa de padding extra se as abas já o tiverem internamente */}
        <div className="backdrop-blur-md bg-white/50 rounded-2xl shadow-2xl border border-white/40 overflow-hidden">
             <div className="p-1 sm:p-2 md:p-0"> {/* Removido padding excessivo aqui, as abas podem gerir o seu */}
                {renderTabContent()}
            </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { EyeClosedIcon } from '../../../ui/icons/EyeClosedIcon';
import { EyeIcon } from '../../../ui/icons/EyeIcon';
import { formattedNumbers } from '../../../../utils/formattedNumbers';
import { useAccounts } from '../../../../context/accounts-context';
import { useNavigate } from 'react-router-dom'; // Importa el hook para navegar

const AccountsList: React.FC = () => {
  const { accounts } = useAccounts(); // Accede a las cuentas desde el contexto
  const navigate = useNavigate(); // Usamos `useNavigate` para redirigir a la página del perfil

  const handleAccountClick = (accountId: number) => {
    // Navegar al perfil de la cuenta
    navigate(`/account/${accountId}`);
  };

  return (
    <div>
      {accounts.map(account => (
        <div
          key={account.id_account}
          className="relative w-[28rem] h-22 bg-personalizedPink border-4 border-black rounded-2xl flex items-center justify-between text-black p-4 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl cursor-pointer"
          onClick={() => handleAccountClick(account.id_account as number)} // Navegar al perfil
        >
          <div className="flex items-center justify-start w-1/3">
            <p className="text-xl font-bold text-black truncate">{account.name}</p>
          </div>

          <div className="flex items-center justify-center w-1/3">
            {account.visibility ? (
              <EyeIcon className="text-black" />
            ) : (
              <EyeClosedIcon className="text-black" />
            )}
          </div>

          <div className="flex items-center justify-end w-1/3">
            <span className="text-xl font-bold text-black">
              {formattedNumbers(account.balance)} €
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountsList;
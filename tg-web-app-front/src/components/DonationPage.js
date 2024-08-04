import React, { } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { THEME, TonConnectUIProvider, useTonConnectUI, useTonWallet, useTonConnectModal} from '@tonconnect/ui-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #041523;
  border-radius: 20px;
  padding: 2vh;
  margin-bottom: 2vh;
  width: 90%;
  color: #fff;
  font-family: "Inter";
  font-weight: Regular;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const DonateContainer = styled.div`
  padding: 0vh;
  width: 90%;
  background-color: rgba(4, 21, 35, 0.01);
  border-radius: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  color: #fff;
  text-align: left;
  margin: auto;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin: 2vh 0 2vh 0;
  font-family: "Inter";
  font-weight: Semi Bold;
`;

const SectionDescription = styled.p`
  font-size: 14px;
  margin: 0 0 2vh 0;
  font-family: "Inter";
  font-weight: Regular;
`;

const DonateButtonAdRevenue = styled.button`
  width: 100%;
  background-color: rgba(111, 46, 24, 0.41); 
  border: 1px solid #EF8332;
  color: #EF8332;
  border-radius: 10px;
  padding: 3.5vh;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  font-family: "Inter";
  font-weight: Semi Bold;
  margin-top: 2vh;
`;

const DonateButtonAdditional = styled.button`
  width: 100%;
  background-color: #ef8332;
  color: black;
  border: none;
  border-radius: 10px;
  padding: 3.5vh;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  font-family: "Inter";
  font-weight: Semi Bold;
  margin-top: 2vh;
`;

const DonationPage = ({ language }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { balance, chatId } = location.state || { balance: '0.00', chatId: null };
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const { open } = useTonConnectModal();

  const handleDonateClick = () => {
    const originalAmount = parseFloat(balance);
    const doubledAmount = originalAmount * 2;
    navigate('/confirmation-page', { state: { originalAmount, doubledAmount, chatId } });
  };

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      window.history.back();
    }
  };

  const handleSendTransaction = () => {
    if (!wallet) {
      return;
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [
        {
          address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
          amount: "1000000000", // 1 TON
        }
      ]
    };

    tonConnectUI.sendTransaction(transaction).then(() => {
      // handle success
    }).catch(error => {
      // handle error
    });
  };

  const handleDonateTonClick = () => {
    if (!wallet) {
      open();
    } else {
      handleSendTransaction();
    }
  };

  return (
    <TonConnectUIProvider
      manifestUrl="https://raw.githubusercontent.com/daanicccch/tonconnect-manifest.json/0b296931f4ab3d2fe8500ccea215f5edbf4302b2/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "tonwallet",
            name: "TON Wallet",
            imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
            aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
            universalLink: "https://wallet.ton.org/ton-connect",
            jsBridgeKey: "tonwallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "android"]
          },
          {
            appName: "tonspace",
            name: "TonSpace Wallet",
            imageUrl: "https://example.com/tonspace-icon.png",
            aboutUrl: "https://tonspace.com",
            universalLink: "https://tonspace.com/ton-connect",
            deepLink: "tonspace-tc://",
            jsBridgeKey: "tonspaceWallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "safari", "ios", "android"]
          },          
          {
            appName: "nicegramWallet",
            name: "Nicegram Wallet",
            imageUrl: "https://static.nicegram.app/icon.png",
            aboutUrl: "https://nicegram.app",
            universalLink: "https://nicegram.app/tc",
            deepLink: "nicegram-tc://",
            jsBridgeKey: "nicegramWallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["ios", "android"]
          },
          {
            appName: "binanceTonWeb3Wallet",
            name: "Binance Web3 Wallet",
            imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMEIwRTExIi8+CjxwYXRoIGQ9Ik01IDE1TDcuMjU4MDYgMTIuNzQxOUw5LjUxNjEzIDE1TDcuMjU4MDYgMTcuMjU4MUw1IDE1WiIgZmlsbD0iI0YwQjkwQiIvPgo8cGF0aCBkPSJNOC44NzA5NyAxMS4xMjlMMTUgNUwyMS4xMjkgMTEuMTI5TDE4Ljg3MSAxMy4zODcxTDE1IDkuNTE2MTNMMTEuMTI5IDEzLjM4NzFMOC44NzA5NyAxMS4xMjlaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMi43NDE5IDE1TDE1IDEyLjc0MTlMMTcuMjU4MSAxNUwxNSAxNy4yNTgxTDEyLjc0MTkgMTVaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMS4xMjkgMTYuNjEyOUw4Ljg3MDk3IDE4Ljg3MUwxNSAyNUwyMS4xMjkgMTguODcxTDE4Ljg3MSAxNi42MTI5TDE1IDIwLjQ4MzlMMTEuMTI5IDE2LjYxMjl6IiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0yMC40ODM5IDE1TDIyLjc0MTkgMTIuNzQxOUwyNSAxNUwyMi43NDE5IDE3LjI1ODFMMjAuNDgzOSAxNVoiIGZpbGw9IiNGMEI5MEIiLz4KPC9zdmc+Cg==",
            aboutUrl: "https://www.binance.com/en/web3wallet",
            deepLink: "bnc://app.binance.com/cedefi/ton-connect",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "safari", "ios", "android"],
            universalLink: "https://app.binance.com/cedefi/ton-connect"
          }
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/DemoDappWithTonConnectBot/demo'
      }}
    >
      <ModalOverlay onClick={handleClickOutside}>
        <ModalContainer>
          <DonateContainer>
            <SectionTitle>
              {language === 'ru' ? 'Пожертвования из дохода от рекламы' : 'Donations from Ad Revenue'}
            </SectionTitle>
            <SectionDescription>
              {language === 'ru' 
                ? 'Пожертвуйте средства из дохода от рекламы в поддержку животных. EcoHero удвоит ваш взнос.'
                : 'Donate funds from ad revenue to support animals. EcoHero will double your contribution.'}
            </SectionDescription>
            <DonateButtonAdRevenue onClick={handleDonateClick}>
              {language === 'ru' ? `Пожертвовать ${balance} ₽` : `Donate ${balance} $`}
            </DonateButtonAdRevenue>

            <SectionTitle>
              {language === 'ru' ? 'Дополнительные пожертвования' : 'Additional Donations'}
            </SectionTitle>
            <SectionDescription>
              {language === 'ru' 
                ? 'Пожертвуйте собственные средства в поддержку животных.'
                : 'Donate your own funds to support animals.'}
            </SectionDescription>
            <DonateButtonAdditional onClick={handleDonateTonClick}>
              {language === 'ru' ? 'Пожертвовать 1 TON' : 'Donate 1 TON'}
            </DonateButtonAdditional>
          </DonateContainer>
        </ModalContainer>
      </ModalOverlay>
    </TonConnectUIProvider>
  );
};

export default DonationPage;

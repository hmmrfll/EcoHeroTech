import { Locales, useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect } from 'react';

const Settings = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

    const onLanguageChange = (lang) => {
        setOptions({ language: lang });
    };

    const myTransaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages: [
            {
                address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
                amount: "20000000",
            },
            {
                address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",
                amount: "60000000",
            }
        ]
    };

    useEffect(() => {
        tonConnectUI.onStatusChange(wallet => {
            if (wallet.connectItems?.tonProof && 'proof' in wallet.connectItems.tonProof) {
                checkProofInYourBackend(wallet.connectItems.tonProof.proof, wallet.account);
            }
        });
    }, [tonConnectUI]);

    const setRequestParameters = async () => {
        tonConnectUI.setConnectRequestParameters({ state: 'loading' });

        const tonProofPayload = await fetchTonProofPayloadFromBackend();

        if (!tonProofPayload) {
            tonConnectUI.setConnectRequestParameters(null);
        } else {
            tonConnectUI.setConnectRequestParameters({
                state: 'ready',
                value: { tonProof: tonProofPayload }
            });
        }
    };

    const fetchTonProofPayloadFromBackend = async () => {
        // Ваш код для получения tonProofPayload от бэкенда
        // Этот пример возвращает фиктивные данные для демонстрации
        return "example-ton-proof-payload";
    };

    const checkProofInYourBackend = async (proof, account) => {
        // Ваш код для проверки proof на вашем бэкенде
        console.log("Proof:", proof);
        console.log("Account:", account);
    };

    return (
        <div>
            <button onClick={() => tonConnectUI.sendTransaction(myTransaction)}>
                Send transaction
            </button>
            <button onClick={setRequestParameters}>Set Request Parameters</button>
            <div>
                <label>Language</label>
                <select onChange={e => onLanguageChange(e.target.value)}>
                    <option value="en">en</option>
                    <option value="ru">ru</option>
                </select>
            </div>
        </div>
    );
};

export default Settings;
export { Locales };

import { updateUserBalanceAndEcha, getUserByChatId } from './userService';

const loadTMAdsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.TMAds) {
      resolve(window.TMAds);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.tmads.xyz/tmadsSdk.js';
      script.async = true;
      script.onload = () => {
        if (window.TMAds) {
          resolve(window.TMAds);
        } else {
          reject(new Error('Не удалось загрузить TMAds SDK'));
        }
      };
      script.onerror = () => reject(new Error('Не удалось загрузить TMAds SDK'));
      document.head.appendChild(script);
    }
  });
};

const initializeAdController = async () => {
  try {
    const TMAds = await loadTMAdsScript();
    TMAds.setDebugMode(false); // тестовый режим
    TMAds.init({
      app_key: '6d1f1c3a5c6594b89a3d62b6499835c1',
      init_data: window.Telegram.WebApp.initData,
      init_data_unsafe: window.Telegram.WebApp.initDataUnsafe
    });
    return TMAds;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Неизвестная ошибка');
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

// Показ рекламы и обработка результата
const handleShowAd = async (chatId, language, setAnimate, navigate) => {
  try {
    const TMAds = await initializeAdController();

    TMAds.checkRewardedAd().then(() => {
      TMAds.addCallback("onRewardedAdShowSuccess", async () => {
        let amount;
        if (language === 'ru') {
          amount = (Math.random() * (0.36 - 0.25) + 0.25).toFixed(2);
        } else {
          amount = (Math.random() * (0.0042 - 0.0029) + 0.0029).toFixed(4);
        }
        const echaCoins = 5000;

        await updateUserBalanceAndEcha(chatId, parseFloat(amount), echaCoins);

        // Получение текущего количества echaCoins после обновления
        const updatedData = await getUserByChatId(chatId);
        const updatedEchaCoins = parseFloat(updatedData.echaCoins);

        console.log(`Ad success - updated EchaCoins: ${updatedEchaCoins}`); // Log updated value
        if (navigate && typeof navigate === 'function') {
          setAnimate(true); // Set animate to true
          navigate('/', { state: { refresh: true, updatedEchaCoins: updatedEchaCoins } });
        } else {
          console.error('Navigate is not a function');
        }
      });

      TMAds.addCallback("onRewardedAdShowFail", () => {
        console.error('Ошибка при показе рекламы или пользователь пропустил видео');
      });

      TMAds.showRewardedAd();
    }).catch((error) => {
      if (error instanceof Error) {
        console.error(`Ошибка при загрузке рекламы: ${error.message || 'Неизвестная ошибка'}`);
      } else {
        console.error('Ошибка при загрузке рекламы: Неизвестная ошибка');
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Ошибка при загрузке рекламы: ${error.message || 'Неизвестная ошибка'}`);
    } else {
      console.error('Ошибка при загрузке рекламы: Неизвестная ошибка');
    }
  }
};

export { handleShowAd };

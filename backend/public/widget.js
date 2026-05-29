(function () {
  // 1. Extract script parameters
  const scriptTag = document.currentScript;
  const chatbotId = scriptTag.getAttribute('data-bot-id');
  const backendUrl = new URL(scriptTag.src).origin;

  if (!chatbotId) {
    console.error('AI Chatbot: data-bot-id attribute is missing from the embed script.');
    return;
  }

  // 2. Fetch Chatbot Public Configuration
  fetch(`${backendUrl}/api/public/chatbot/${chatbotId}`)
    .then(res => {
      if (!res.ok) throw new Error('Chatbot profile unreachable.');
      return res.json();
    })
    .then(config => {
      initializeWidget(config);
    })
    .catch(err => {
      console.warn('AI Chatbot Widget initialization delayed. Retrying in fallback mode...', err);
      // Fallback configuration if API is slow or offline
      initializeWidget({
        id: chatbotId,
        bot_name: 'Support Bot',
        theme_color: '#6366f1',
        welcome_message: 'Hello! How can I help you today?'
      });
    });

  function initializeWidget(config) {
    // Generate visitor tracking ID if not stored in localStorage
    let visitorId = localStorage.getItem('ai_chatbot_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('ai_chatbot_visitor_id', visitorId);
    }

    // 3. Inject CSS Styles for Launcher and Drawer Window
    const style = document.createElement('style');
    style.innerHTML = `
      #ai-chat-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      
      .ai-chat-launcher {
        width: 60px;
        height: 60px;
        border-radius: 30px;
        background-color: ${config.theme_color};
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s;
      }
      
      .ai-chat-launcher:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      }
      
      .ai-chat-launcher svg {
        fill: #ffffff;
        width: 28px;
        height: 28px;
        transition: transform 0.3s ease;
      }

      .ai-chat-launcher.active svg {
        transform: rotate(90deg);
      }

      .ai-chat-frame-container {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 380px;
        height: 580px;
        border-radius: 16px;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        display: none;
        background: #ffffff;
        transform: translateY(20px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      @media (max-width: 480px) {
        #ai-chat-widget-container {
          bottom: 10px;
          right: 10px;
        }
        .ai-chat-frame-container {
          width: calc(100vw - 20px);
          height: calc(100vh - 100px);
          max-height: 600px;
        }
      }

      .ai-chat-frame-container.open {
        display: block;
        transform: translateY(0);
        opacity: 1;
      }

      .ai-chat-frame-container iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
      }
    `;
    document.head.appendChild(style);

    // 4. Construct Widget DOM Elements
    const container = document.createElement('div');
    container.id = 'ai-chat-widget-container';

    const launcher = document.createElement('div');
    launcher.className = 'ai-chat-launcher';
    launcher.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
      </svg>
    `;

    const frameContainer = document.createElement('div');
    frameContainer.className = 'ai-chat-frame-container';

    // Construct Iframe URL loaded from express server
    const iframe = document.createElement('iframe');
    iframe.src = `${backendUrl}/widget-frame.html?botId=${config.id}&visitorId=${visitorId}&themeColor=${encodeURIComponent(config.theme_color)}&botName=${encodeURIComponent(config.bot_name)}`;
    frameContainer.appendChild(iframe);

    container.appendChild(frameContainer);
    container.appendChild(launcher);
    document.body.appendChild(container);

    // 5. Setup Action Click Listeners
    let isOpen = false;
    launcher.addEventListener('click', () => {
      isOpen = !isOpen;
      if (isOpen) {
        frameContainer.style.display = 'block';
        setTimeout(() => {
          frameContainer.classList.add('open');
          launcher.classList.add('active');
          // Update SVG to Close Icon
          launcher.innerHTML = `
            <svg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          `;
        }, 10);
      } else {
        frameContainer.classList.remove('open');
        launcher.classList.remove('active');
        setTimeout(() => {
          frameContainer.style.display = 'none';
        }, 300);
        // Restore Chat SVG icon
        launcher.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
          </svg>
        `;
      }
    });
  }
})();

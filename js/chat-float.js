/**
 * Chat floating panel with quick-reply buttons. Works with or without full script.js.
 */
(function () {
    function toggleChat() {
        var w = document.getElementById('chat-window');
        var t = document.getElementById('chat-toggle');
        if (w && t) {
            w.classList.toggle('open');
            t.setAttribute('aria-expanded', w.classList.contains('open'));
        }
    }

    function sendQuickReply(msg) {
        var messages = document.getElementById('chat-messages');
        if (!messages) return;
        var userDiv = document.createElement('div');
        userDiv.className = 'message user-message';
        userDiv.innerHTML = '<div class="message-content">' + escapeHtml(msg) + '</div>';
        messages.appendChild(userDiv);
        messages.scrollTop = messages.scrollHeight;

        var botReply = getBotReply(msg);
        setTimeout(function () {
            var botDiv = document.createElement('div');
            botDiv.className = 'message bot-message';
            botDiv.innerHTML = '<div class="message-content">' + botReply + '</div>';
            messages.appendChild(botDiv);
            messages.scrollTop = messages.scrollHeight;
        }, 600);
    }

    function escapeHtml(s) {
        var div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    function getBotReply(msg) {
        var m = (msg || '').toLowerCase();
        var suggestion = '';
        var condition = '';
        if (m.indexOf('headache') !== -1) {
            condition = 'Possible tension headache or migraine';
            suggestion = 'Rest, hydration, and over-the-counter pain relief may help. If severe or frequent, consider booking a doctor for evaluation.';
        } else if (m.indexOf('fever') !== -1) {
            condition = 'Possible infection or viral illness';
            suggestion = 'Monitor your temperature and stay hydrated. If fever is high or lasts more than 3 days, book a doctor for assessment.';
        } else if (m.indexOf('chest pain') !== -1) {
            condition = 'Chest pain can have many causes';
            suggestion = 'Seek urgent care if pain is severe or you have shortness of breath. For mild or recurring symptoms, book a cardiologist or GP.';
        } else if (m.indexOf('anxious') !== -1) {
            condition = 'Anxiety or stress-related symptoms';
            suggestion = 'Talking to a mental health professional or GP can help. You can book a consultation with one of our doctors.';
        } else if (m.indexOf('rash') !== -1 || m.indexOf('skin') !== -1) {
            condition = 'Possible skin condition or allergic reaction';
            suggestion = 'A dermatologist can diagnose and recommend treatment. Book a consultation to get expert advice.';
        } else if (m.indexOf('short of breath') !== -1 || m.indexOf('breath') !== -1) {
            condition = 'Shortness of breath can be serious';
            suggestion = 'If severe or sudden, seek emergency care. For mild or chronic symptoms, book a doctor to rule out asthma, anxiety, or other causes.';
        } else {
            condition = 'General health concern';
            suggestion = 'I recommend speaking with a doctor for personalized advice. You can book a consultation on our Find Doctors page.';
        }
        return '<strong>' + condition + '</strong><br><br>' + suggestion + '<br><br><a href="find-doctors.html" class="chat-cta-link">Book a doctor &rarr;</a>';
    }

    document.addEventListener('DOMContentLoaded', function () {
        var quickReplies = document.querySelectorAll('.quick-reply');
        quickReplies.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var msg = this.getAttribute('data-msg') || this.textContent;
                sendQuickReply(msg);
            });
        });

        var chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    var v = this.value.trim();
                    if (v) {
                        sendQuickReply(v);
                        this.value = '';
                    }
                }
            });
        }

        var toggleBtn = document.getElementById('chat-toggle');
        if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);
        document.querySelectorAll('.chat-header button').forEach(function (btn) {
            btn.addEventListener('click', toggleChat);
        });
        var sendBtn = document.querySelector('.chat-input button');
        if (sendBtn) sendBtn.addEventListener('click', function () { window.sendMessage && window.sendMessage(); });
    });

    window.sendMessage = function () {
        var input = document.getElementById('chat-input');
        if (input && input.value.trim()) {
            sendQuickReply(input.value.trim());
            input.value = '';
        }
    };

    window.toggleChat = toggleChat;
    window.sendQuickReply = sendQuickReply;
})();

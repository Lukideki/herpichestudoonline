import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
    const codeEditor = document.getElementById('code-editor');
    const runButton = document.getElementById('run-button');
    const clearConsoleButton = document.getElementById('clear-console-button');
    const outputConsole = document.getElementById('output-console');

    // Pre-fill code editor with an example if it's empty
    if (!codeEditor.value.trim()) {
        codeEditor.value = "console.log('Olá, Mundo Interativo!');\nconsole.log('Experimente mudar este texto.');\n\n// Tente declarar uma variável:\n// let minhaVariavel = 10;\n// console.log(minhaVariavel * 2);";
    }

    runButton.addEventListener('click', () => {
        const code = codeEditor.value;
        // Clear previous output for this run, but keep general console history if desired.
        // For simplicity, we'll clear it. If you want to append, manage that differently.
        // outputConsole.innerHTML = ''; // Decided to append instead of clearing each time

        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const originalConsoleInfo = console.info;
        const originalConsoleDebug = console.debug;
        
        const logToPage = (message, type = 'log') => {
            const entry = document.createElement('div');
            entry.classList.add(`log-${type}`);
            
            if (typeof message === 'object' && message !== null) {
                try {
                    entry.textContent = JSON.stringify(message, null, 2);
                } catch (e) {
                    entry.textContent = String(message);
                }
            } else {
                entry.textContent = String(message);
            }
            outputConsole.appendChild(entry);
            outputConsole.scrollTop = outputConsole.scrollHeight; // Auto-scroll
        };

        console.log = (...args) => {
            originalConsoleLog.apply(console, args);
            args.forEach(arg => logToPage(arg, 'log'));
        };
        console.error = (...args) => {
            originalConsoleError.apply(console, args);
            args.forEach(arg => logToPage(`ERROR: ${arg}`, 'error'));
        };
        console.warn = (...args) => {
            originalConsoleWarn.apply(console, args);
            args.forEach(arg => logToPage(`WARN: ${arg}`, 'warn'));
        };
        console.info = (...args) => {
            originalConsoleInfo.apply(console, args);
            args.forEach(arg => logToPage(`INFO: ${arg}`, 'info'));
        };
        console.debug = (...args) => {
            originalConsoleDebug.apply(console, args);
            args.forEach(arg => logToPage(`DEBUG: ${arg}`, 'debug'));
        };
        

        try {
            // Using new Function() is generally safer than eval()
            const result = new Function(code)();
            if (result !== undefined) {
                // console.log("Resultado da execução:", result); // Already handled by console.log override
            }
            // Simple success feedback
            logToPage('🎉 Código executado com sucesso!', 'info');
            
            // Fun confetti on successful run!
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

        } catch (error) {
            console.error(error.toString());
        } finally {
            // Restore original console functions
            console.log = originalConsoleLog;
            console.error = originalConsoleError;
            console.warn = originalConsoleWarn;
            console.info = originalConsoleInfo;
            console.debug = originalConsoleDebug;
        }
    });

    clearConsoleButton.addEventListener('click', () => {
        outputConsole.innerHTML = '';
        // Optionally, log that console was cleared
        const originalConsoleLog = console.log; // Use original if needed, or just append
        const entry = document.createElement('div');
        entry.textContent = 'Console limpo.';
        entry.style.fontStyle = 'italic';
        entry.style.color = '#aaa';
        outputConsole.appendChild(entry);
        outputConsole.scrollTop = outputConsole.scrollHeight;
    });
});


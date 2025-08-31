// Dashboard Chart Initialization
function initMoodChart() {
    const ctx = document.getElementById('moodChart');
    const placeholder = document.getElementById('chart-placeholder');
    
    if (!ctx) {
        console.error('Mood chart canvas not found');
        return;
    }
    
    try {
        const dates = JSON.parse(ctx.getAttribute('data-dates'));
        const scores = JSON.parse(ctx.getAttribute('data-scores'));
        
        console.log('Chart data:', { dates, scores });
        
        // Show placeholder if no data
        if (!dates || !scores || dates.length === 0 || scores.length === 0) {
            if (placeholder) {
                placeholder.style.display = 'block';
                ctx.style.display = 'none';
            }
            return;
        }
        
        // Hide placeholder and show chart
        if (placeholder) {
            placeholder.style.display = 'none';
            ctx.style.display = 'block';
        }
        
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            throw new Error('Chart.js library not loaded');
        }
        
        // Create the chart
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Mood Score',
                    data: scores,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    pointBackgroundColor: '#388E3C',
                    pointBorderColor: '#ffffff',
                    pointHoverBackgroundColor: '#2E7D32',
                    pointHoverBorderColor: '#ffffff',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text'),
                            font: {
                                size: 14,
                                weight: '600'
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4CAF50',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                return `Mood: ${context.parsed.y.toFixed(2)}`;
                            },
                            title: function (context) {
                                return `Date: ${context[0].label}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        min: 0,
                        ticks: {
                            stepSize: 0.2,
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light'),
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        title: {
                            display: true,
                            text: 'Mood Score',
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text'),
                            font: {
                                size: 14,
                                weight: '600'
                            }
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-light'),
                            font: {
                                size: 12
                            },
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        title: {
                            display: true,
                            text: 'Date',
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text'),
                            font: {
                                size: 14,
                                weight: '600'
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
        
        console.log('Mood chart initialized successfully');
        
    } catch (error) {
        console.error('Error initializing mood chart:', error);
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="placeholder-icon">❌</div>
                <p>Error loading chart: ${error.message}</p>
                <button onclick="initMoodChart()" class="btn">Retry</button>
            `;
            placeholder.style.display = 'block';
            ctx.style.display = 'none';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mindful Minutes dashboard loaded');
    
    // Initialize mood chart
    initMoodChart();
    
    // Meditation Timer (if exists on this page)
    const timerBtn = document.getElementById('timerBtn');
    const timerDisplay = document.getElementById('timer');

    if (timerBtn && timerDisplay) {
        timerBtn.addEventListener('click', function () {
            let timeLeft = 120;
            timerBtn.disabled = true;
            timerBtn.textContent = "Meditation in progress...";

            const timerInterval = setInterval(() => {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    timerDisplay.textContent = "🧘 Time's up!";
                    timerBtn.disabled = false;
                    timerBtn.textContent = "Start 2-Minute Timer";
                    
                    // Add celebration effect
                    timerDisplay.classList.add('celebrate');
                    setTimeout(() => {
                        timerDisplay.classList.remove('celebrate');
                    }, 2000);
                }

                timeLeft--;
            }, 1000);
        });
    }
});
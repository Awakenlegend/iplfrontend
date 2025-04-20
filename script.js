document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const teamsGrid = document.getElementById('teamsGrid');
    const statsContainer = document.getElementById('statsContainer');
    const successNotification = document.getElementById('successNotification');
    const leaderNotification = document.getElementById('leaderNotification');
    const statsLink = document.getElementById('statsLink');
    const statsToggle = document.getElementById('statsToggle');
    const statsSection = document.getElementById('statsSection');

    // Create notification overlay with mobile-friendly styles
    const notificationOverlay = document.createElement('div');
    notificationOverlay.style.cssText = `
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        padding: 20px;
        width: 90%;
        max-width: 320px;
        border-radius: 10px;
        border: 2px solid #FFD700;
        color: #FFD700;
        font-size: 16px;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    `;
    document.body.appendChild(notificationOverlay);

    // Create leader notification overlay with mobile-friendly styles
    const leaderOverlay = document.createElement('div');
    leaderOverlay.style.cssText = `
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        padding: 20px;
        width: 90%;
        max-width: 320px;
        border-radius: 15px;
        border: 2px solid #FFD700;
        color: #FFD700;
        font-size: 16px;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
    `;
    document.body.appendChild(leaderOverlay);

    // Function to show notification
    function showNotification(teamName, teamVotes) {
        notificationOverlay.innerHTML = `
            <h3 style="color: #FFD700; margin-bottom: 10px; font-size: 18px;">Thank You!</h3>
            <p style="margin-bottom: 15px; font-size: 16px;">Your vote for ${teamName} has been recorded.</p>
            <p style="color: #94a3b8; font-size: 14px;">${teamName} Votes: ${teamVotes}</p>
        `;
        notificationOverlay.style.display = 'block';
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notificationOverlay.style.display = 'none';
        }, 3000);
    }

    // Function to show leader notification
    async function showLeaderNotification() {
        try {
            const response = await fetch(`${PROXY_URL}/stats`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            const data = await response.json();

            const sortedTeams = Object.entries(data.team_votes || {})
                .sort(([, votesA], [, votesB]) => votesB - votesA);

            if (sortedTeams.length > 0) {
                const [teamCode, votes] = sortedTeams[0];
                const teamName = teamMapping[teamCode]?.name || teamCode;
                
                leaderOverlay.innerHTML = `
                    <div style="
                        animation: fadeIn 0.5s ease-out;
                    ">
                        <h3 style="color: #FFD700; margin-bottom: 15px; font-size: 20px;">Current Leader</h3>
                        <p style="margin-bottom: 15px; font-size: 18px;">${teamName}</p>
                        <p style="color: #94a3b8; font-size: 14px;">Total Votes: ${votes}</p>
                        <button style="
                            margin-top: 15px;
                            padding: 8px 20px;
                            background: #FFD700;
                            color: black;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 16px;
                            width: 100%;
                            max-width: 200px;
                            touch-action: manipulation;
                            transition: background-color 0.3s ease;
                        ">Close</button>
                    </div>
                `;

                // Add fade-in animation style
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translate(-50%, -60%); }
                        to { opacity: 1; transform: translate(-50%, -50%); }
                    }
                `;
                document.head.appendChild(style);

                leaderOverlay.style.display = 'block';

                // Add click event for close button
                const closeButton = leaderOverlay.querySelector('button');
                closeButton.addEventListener('click', () => {
                    leaderOverlay.style.opacity = '0';
                    leaderOverlay.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        leaderOverlay.style.display = 'none';
                        leaderOverlay.style.opacity = '1';
                    }, 300);
                });

                // Add hover effect to close button
                closeButton.addEventListener('mouseover', () => {
                    closeButton.style.backgroundColor = '#FFE44D';
                });
                closeButton.addEventListener('mouseout', () => {
                    closeButton.style.backgroundColor = '#FFD700';
                });
            }
        } catch (error) {
            console.error('Error fetching leader stats:', error);
        }
    }

    // Team mapping for consistent naming
    const teamMapping = {
        'CSK': { 
            name: 'Chennai Super Kings', 
            image: 'csk1.jpg',
            color: 'rgba(255, 205, 0, 0.8)'      // CSK Yellow
        },
        'MI': { 
            name: 'Mumbai Indians', 
            image: 'mi.jpg',
            color: 'rgba(0, 102, 204, 0.8)'      // MI Blue
        },
        'RCB': { 
            name: 'Royal Challengers Bangalore', 
            image: 'rcb.jpg',
            color: 'rgba(205, 0, 0, 0.8)'        // RCB Red
        },
        'KKR': { 
            name: 'Kolkata Knight Riders', 
            image: 'kkr.jpg',
            color: 'rgba(75, 0, 130, 0.8)'       // KKR Purple
        },
        'DC': { 
            name: 'Delhi Capitals', 
            image: 'dc1.jpg',
            color: 'rgba(0, 70, 152, 0.8)'       // DC Blue
        },
        'PBKS': { 
            name: 'Punjab Kings', 
            image: 'pks.jpg',
            color: 'rgba(236, 28, 36, 0.8)'      // PBKS Red
        },
        'RR': { 
            name: 'Rajasthan Royals', 
            image: 'rr.jpg',
            color: 'rgba(255, 68, 153, 0.8)'     // RR Pink
        },
        'SRH': { 
            name: 'Sunrisers Hyderabad', 
            image: 'srh.jpg',
            color: 'rgba(255, 128, 0, 0.8)'      // SRH Orange
        },
        'GT': { 
            name: 'Gujarat Titans', 
            image: 'gt.jpg',
            color: 'rgba(25, 59, 103, 0.8)'      // GT Navy Blue
        },
        'LSG': { 
            name: 'Lucknow Super Giants', 
            image: 'lsg.jpg',
            color: 'rgba(0, 185, 242, 0.8)'      // LSG Light Blue
        }
    };

    // Base URL for the proxy server
    const PROXY_URL = 'https://iplbackend-xenz.onrender.com';

    // Cache-busting timestamp
    const cacheBust = new Date().getTime();

    // Initialize chart
    let votesChart = null;

    // Render teams
    function renderTeams() {
        console.log('Rendering teams...'); // Debug log
        if (!teamsGrid) {
            console.error('Teams grid element not found!');
            return;
        }
        teamsGrid.innerHTML = '';
        Object.entries(teamMapping).forEach(([code, team]) => {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.dataset.team = code;
            card.style.borderColor = team.color;
            card.innerHTML = `
                <img src="images/${team.image}?v=${cacheBust}" alt="${team.name}" loading="lazy">
                <h3 style="color: ${team.color}">${team.name}</h3>
                <button class="vote-btn" style="background: ${team.color}"">Vote</button>
            `;
            teamsGrid.appendChild(card);
        });
        console.log('Teams rendered successfully!'); // Debug log
    }

    // Fetch and update stats
    async function updateStats() {
        try {
            const response = await fetch(`${PROXY_URL}/stats`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            // Sort and prepare team data
            const sortedTeams = Object.entries(data.team_votes || {})
                .sort(([, votesA], [, votesB]) => votesB - votesA);

            if (sortedTeams.length === 0) {
                console.log('No team data available');
                return;
            }

            const labels = [];
            const votes = [];
            const colors = [];

            // Team colors mapping with exact team names as keys
            const teamColors = {
                'Royal Challengers Bangalore': '#FF0000',  // RCB Red
                'Chennai Super Kings': '#FDB913',          // CSK Yellow
                'Lucknow Super Giants': '#00FFFF',        // LSG Cyan
                'Mumbai Indians': '#004BA0',              // MI Blue
                'Delhi Capitals': '#0078BC',             // DC Blue
                'Gujarat Titans': '#1B2133',             // GT Navy
                'Kolkata Knight Riders': '#3A225D',      // KKR Purple
                'Sunrisers Hyderabad': '#FF8C00',        // SRH Orange
                'Punjab Kings': '#ED1C24',               // PBKS Red
                'Rajasthan Royals': '#FF1493'           // RR Pink
            };

            sortedTeams.forEach(([teamCode, voteCount]) => {
                const teamName = teamMapping[teamCode]?.name || teamCode;
                labels.push(teamName);
                votes.push(voteCount);
                const color = teamColors[teamName] || '#4BC0C0';
                colors.push(color);
                // Debug log
                console.log(`Team: ${teamName}, Color: ${color}`);
            });

            // Debug log
            console.log('Chart data:', { labels, votes, colors });

            const canvas = document.getElementById('votesChart');
            if (!canvas || !canvas.getContext) {
                console.error('Canvas not found or context not available');
                return;
            }

            const ctx = canvas.getContext('2d');
            
            if (votesChart) {
                console.log('Destroying old chart');
                votesChart.destroy();
            }

            // Create new chart
            votesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Votes',
                        data: votes,
                        backgroundColor: colors,
                        borderWidth: 0,
                        borderRadius: {
                            topLeft: 4,
                            topRight: 4,
                            bottomLeft: 0,
                            bottomRight: 0
                        },
                        maxBarThickness: 35
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                stepSize: 1,
                                color: '#94a3b8',
                                font: {
                                    family: 'system-ui',
                                    size: 12
                                },
                                padding: 10
                            },
                            border: {
                                display: false
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                color: '#94a3b8',
                                font: {
                                    family: 'system-ui',
                                    size: 12
                                },
                                maxRotation: 45,
                                minRotation: 45,
                                padding: 10
                            },
                            border: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'IPL Team Vote Distribution',
                            color: '#FFD700',
                            font: {
                                size: 24,
                                weight: 'bold',
                                family: 'system-ui'
                            },
                            padding: {
                                top: 20,
                                bottom: 30
                            }
                        }
                    },
                    animation: {
                        duration: 500
                    }
                }
            });

            // Debug log
            console.log('Chart created:', votesChart);
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    // Handle vote button clicks
    if (teamsGrid) {
        teamsGrid.addEventListener('click', async (event) => {
            if (!event.target.classList.contains('vote-btn')) return;
            
            const button = event.target;
            const teamCard = button.closest('.team-card');
            if (!teamCard) return;

            const teamCode = teamCard.dataset.team;
            const teamName = teamMapping[teamCode]?.name;
            if (!teamName) return;

            button.disabled = true;
            button.textContent = 'Voting...';
            
            try {
                const response = await fetch(`${PROXY_URL}/vote`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ team_name: teamName }),
                });

                if (!response.ok) {
                    throw new Error('Failed to record vote');
                }

                // Get updated stats to show team votes
                const statsResponse = await fetch(`${PROXY_URL}/stats`);
                const statsData = await statsResponse.json();
                
                // Get the specific team's votes
                const teamVotes = statsData.team_votes[teamName] || 0;
                
                // Show thank you notification with team's votes
                showNotification(teamName, teamVotes);

                await updateStats();
            } catch (error) {
                console.error('Vote error:', error);
            } finally {
                button.disabled = false;
                button.textContent = 'Vote';
            }
        });
    }

    // Handle stats link click
    if (statsLink) {
        statsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const statsSection = document.getElementById('statsSection');
            const votingSection = document.querySelector('.voting-section');
            const hero = document.querySelector('.hero');

            // Show stats
            statsSection.style.display = 'block';
            votingSection.style.display = 'none';
            hero.style.display = 'none';
            statsLink.classList.add('active');
            document.querySelector('.nav-links a:first-child').classList.remove('active');
            updateStats();
        });
    }

    // Handle close button click
    const closeStatsBtn = document.getElementById('closeStats');
    if (closeStatsBtn) {
        closeStatsBtn.addEventListener('click', () => {
            const statsSection = document.getElementById('statsSection');
            const votingSection = document.querySelector('.voting-section');
            const hero = document.querySelector('.hero');

            // Hide stats
            statsSection.style.display = 'none';
            votingSection.style.display = 'block';
            hero.style.display = 'block';
            statsLink.classList.remove('active');
            document.querySelector('.nav-links a:first-child').classList.add('active');
        });
    }

    // Initial setup
    console.log('Initializing application...'); // Debug log
    renderTeams();
    updateStats();
    showLeaderNotification(); // Show leader on page load

    // Update stats periodically and show leader
    const updateInterval = setInterval(() => {
        updateStats();
    }, 5000);

    // Cleanup
    window.addEventListener('unload', () => {
        clearInterval(updateInterval);
        if (votesChart) {
            votesChart.destroy();
        }
    });
});
  
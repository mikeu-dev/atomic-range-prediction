<script lang="ts">
    import { t } from "$lib/i18n";

    let selectedTopic: string | null = null;
    let showPanel = false;

    interface Topic {
        id: string;
        title: string;
        titleId: string;
        icon: string;
        content: string;
        contentId: string;
    }

    const topics: Topic[] = [
        {
            id: "blast-zones",
            title: "Blast Zones Explained",
            titleId: "Penjelasan Zona Ledakan",
            icon: "💥",
            content: `
                <h3>Understanding Blast Zones</h3>
                <p>Nuclear explosions create concentric zones of destruction based on overpressure (PSI) and radiation (REM):</p>
                <ul>
                    <li><strong>🔥 Fireball (> 200 psi):</strong> Extreme heat (20m °C). Immediate vaporization.</li>
                    <li><strong>☢️ Radiation (500+ rem):</strong> Lethal dose. Fatalities within 48 hours.</li>
                    <li><strong>💥 Heavy Blast (20 psi):</strong> Concrete buildings destroyed. Heavily reinforced structures collapse.</li>
                    <li><strong>💣 Moderate Blast (5 psi):</strong> Residential houses collapse. Widespread fatalities.</li>
                    <li><strong>🌊 Light Blast (1 psi):</strong> Glass shatters. Injuries from debris.</li>
                    <li><strong>🌡️ Thermal Radiation:</strong> 3rd degree burns. Can ignite fires miles away.</li>
                </ul>
                <p><em>PSI = Pounds per Square Inch (Pressure). REM = Roentgen Equivalent Man (Radiation dose).</em></p>
            `,
            contentId: `
                <h3>Penjelasan Zona Ledakan</h3>
                <p>Ledakan nuklir menciptakan zona destruksi konsentris berdasarkan tekanan (PSI) dan dosis radiasi (REM):</p>
                <ul>
                    <li><strong>🔥 Bola Api (> 200 psi):</strong> Panas ekstrem (20jt °C). Penguapan instan material.</li>
                    <li><strong>☢️ Radiasi (500+ rem):</strong> Dosis mematikan. Kematian dalam 48 jam.</li>
                    <li><strong>💥 Ledakan Berat (20 psi):</strong> Gedung beton hancur. Struktur bertulang runtuh.</li>
                    <li><strong>💣 Ledakan Sedang (5 psi):</strong> Rumah penduduk runtuh. Kematian massal.</li>
                    <li><strong>🌊 Ledakan Ringan (1 psi):</strong> Kaca pecah. Luka-luka akibat serpihan.</li>
                    <li><strong>🌡️ Radiasi Termal:</strong> Luka bakar tingkat 3. Memicu kebakaran luas.</li>
                </ul>
                <p><em>PSI = Pounds per Square Inch (Tekanan). REM = Satuan dosis radiasi yang diserap tubuh manusia.</em></p>
            `,
        },
        {
            id: "fallout",
            title: "Radioactive Fallout",
            titleId: "Jatuhan Radioaktif",
            icon: "☢️",
            content: `
                <h3>Understanding Fallout</h3>
                <p><strong>What is it?</strong> Radioactive debris from the explosion, carried by wind and gravity.</p>
                <p><strong>Pattern:</strong> Creates an elliptical contamination zone downwind from ground zero. Can extend hundreds of kilometers.</p>
                <p><strong>Danger:</strong></p>
                <ul>
                    <li>Lethal doses within first hour in high-intensity zones</li>
                    <li>Can remain dangerous for weeks to months</li>
                    <li>Contaminates food, water, soil</li>
                    <li>Long-term health effects (cancer, genetic damage)</li>
                </ul>
                <p><strong>Protection:</strong> Shelter in basement or center of building. Avoid contaminated areas. Follow emergency services instructions.</p>
            `,
            contentId: `
                <h3>Memahami Jatuhan Radioaktif</h3>
                <p><strong>Apa itu?</strong> Puing radioaktif dari ledakan, terbawa oleh angin dan gravitasi.</p>
                <p><strong>Pola:</strong> Menciptakan zona kontaminasi elips searah angin dari titik ledakan. Dapat meluas ratusan kilometer.</p>
                <p><strong>Bahaya:</strong></p>
                <ul>
                    <li>Dosis mematikan dalam jam pertama di zona intensitas tinggi</li>
                    <li>Dapat tetap berbahaya selama minggu hingga bulan</li>
                    <li>Mengkontaminasi makanan, air, tanah</li>
                    <li>Efek kesehatan jangka panjang (kanker, kerusakan genetik)</li>
                </ul>
                <p>Perlindungan: Berlindung di basement atau pusat bangunan. Hindari area terkontaminasi. Ikuti instruksi layanan darurat.</p>
            `,
        },
        {
            id: "history",
            title: "Historical Context",
            titleId: "Konteks Sejarah",
            icon: "📜",
            content: `
                <h3>Nuclear Weapons in History</h3>
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Bomb</th>
                            <th>Yield</th>
                            <th>Impact</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Hiroshima</td>
                            <td>Aug 6, 1945</td>
                            <td>Little Boy</td>
                            <td>15 kt</td>
                            <td>~70,000 immediate deaths</td>
                        </tr>
                        <tr>
                            <td>Nagasaki</td>
                            <td>Aug 9, 1945</td>
                            <td>Fat Man</td>
                            <td>21 kt</td>
                            <td>~40,000 immediate deaths</td>
                        </tr>
                        <tr>
                            <td>Tsar Bomba</td>
                            <td>Oct 30, 1961</td>
                            <td>Tsar Bomba</td>
                            <td>50,000 kt</td>
                            <td>Largest ever tested</td>
                        </tr>
                    </tbody>
                </table>
                <p><strong>Legacy:</strong> Only two nuclear weapons have ever been used in warfare (Hiroshima & Nagasaki). Their devastating effects led to the Nuclear Non-Proliferation Treaty and global awareness of nuclear dangers.</p>
            `,
            contentId: `
                <h3>Senjata Nuklir dalam Sejarah</h3>
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Peristiwa</th>
                            <th>Tanggal</th>
                            <th>Bom</th>
                            <th>Yield</th>
                            <th>Dampak</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Hiroshima</td>
                            <td>6 Agustus 1945</td>
                            <td>Little Boy</td>
                            <td>15 kt</td>
                            <td>~70.000 kematian langsung</td>
                        </tr>
                        <tr>
                            <td>Nagasaki</td>
                            <td>9 Agustus 1945</td>
                            <td>Fat Man</td>
                            <td>21 kt</td>
                            <td>~40.000 kematian langsung</td>
                        </tr>
                        <tr>
                            <td>Tsar Bomba</td>
                            <td>30 Oktober 1961</td>
                            <td>Tsar Bomba</td>
                            <td>50.000 kt</td>
                            <td>Terbesar yang pernah diuji</td>
                        </tr>
                    </tbody>
                </table>
                <p><strong>Warisan:</strong> Hanya dua senjata nuklir yang pernah digunakan dalam perang (Hiroshima & Nagasaki). Dampak dahsyat mereka menghasilkan Perjanjian Non-Proliferasi Nuklir dan kesadaran global tentang bahaya nuklir.</p>
            `,
        },
    ];
</script>

<button class="panel-trigger" on:click={() => (showPanel = !showPanel)}>
    <span class="icon">📚</span>
    <span class="text">{$t("educational.learn")}</span>
</button>

{#if showPanel}
    <div
        class="educational-overlay"
        on:click={() => (showPanel = false)}
        on:keydown={(e) => e.key === "Escape" && (showPanel = false)}
        role="button"
        tabindex="0"
        aria-label="Close panel"
    >
        <div
            class="educational-panel glass"
            on:click|stopPropagation
            on:keydown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
        >
            <div class="panel-header">
                <h3>{$t("educational.title")}</h3>
                <button
                    class="close-btn"
                    on:click={() => (showPanel = false)}
                    title="Close"
                >
                    ✕
                </button>
            </div>

            <div class="panel-content">
                {#if !selectedTopic}
                    <div class="topics-grid">
                        {#each topics as topic}
                            <button
                                class="topic-card"
                                on:click={() => (selectedTopic = topic.id)}
                            >
                                <span class="topic-icon">{topic.icon}</span>
                                <span class="topic-title">
                                    {$t("locale") === "en"
                                        ? topic.title
                                        : topic.titleId}
                                </span>
                            </button>
                        {/each}
                    </div>
                {:else}
                    {@const topic = topics.find((t) => t.id === selectedTopic)}
                    {#if topic}
                        <div class="topic-content">
                            {@html $t("locale") === "en"
                                ? topic.content
                                : topic.contentId}
                            <button
                                class="back-btn"
                                on:click={() => (selectedTopic = null)}
                            >
                                ← {$t("educational.back")}
                            </button>
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .panel-trigger {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        padding: var(--space-xs) var(--space-sm);

        background: var(--color-bg-secondary);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);

        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .panel-trigger:hover {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
        transform: translateY(-2px);
    }

    .icon {
        font-size: 1.2rem;
    }

    .text {
        font-size: var(--font-size-sm);
        font-weight: 600;
    }

    .educational-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);

        display: flex;
        align-items: center;
        justify-content: center;

        z-index: 1000;

        animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .educational-panel {
        width: 90%;
        max-width: 800px;
        max-height: 85vh;

        padding: var(--space-2xl);
        border-radius: var(--radius-lg);

        overflow: hidden;
        display: flex;
        flex-direction: column;

        animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-lg);
    }

    .panel-header h3 {
        margin: 0;
        font-size: var(--font-size-xl);
        color: var(--color-text-primary);
    }

    .close-btn {
        width: 32px;
        height: 32px;

        background: var(--color-bg-tertiary);
        border: none;
        border-radius: 50%;

        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        cursor: pointer;

        transition: all var(--transition-fast);
    }

    .close-btn:hover {
        background: var(--color-danger);
        color: white;
    }

    .panel-content {
        flex: 1;
        overflow-y: auto;
    }

    .topics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-md);
    }

    .topic-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-xl);

        background: var(--color-bg-secondary);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);

        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .topic-card:hover {
        background: var(--color-bg-tertiary);
        border-color: var(--color-primary);
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
    }

    .topic-icon {
        font-size: 3rem;
    }

    .topic-title {
        font-size: var(--font-size-base);
        font-weight: 600;
        color: var(--color-text-primary);
        text-align: center;
    }

    .topic-content {
        padding: var(--space-md);
    }

    .topic-content :global(h3) {
        color: var(--color-primary);
        margin-top: 0;
    }

    .topic-content :global(ul) {
        line-height: 1.8;
    }

    .topic-content :global(strong) {
        color: var(--color-text-primary);
    }

    .topic-content :global(.history-table) {
        width: 100%;
        border-collapse: collapse;
        margin: var(--space-md) 0;
    }

    .topic-content :global(.history-table th),
    .topic-content :global(.history-table td) {
        padding: var(--space-sm);
        border: 1px solid var(--color-border);
        text-align: left;
    }

    .topic-content :global(.history-table th) {
        background: var(--color-bg-tertiary);
        font-weight: 700;
    }

    .back-btn {
        margin-top: var(--space-lg);
        padding: var(--space-sm) var(--space-lg);

        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);

        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .back-btn:hover {
        background: hsl(24, 100%, 55%);
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        .educational-panel {
            width: 95%;
            padding: var(--space-lg);
        }

        .topics-grid {
            grid-template-columns: 1fr;
        }

        .text {
            display: none;
        }
    }
</style>

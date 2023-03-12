<script>
  import Main from "./Main.svelte";
  import { BaseDirectory, writeFile, readTextFile } from "@tauri-apps/api/fs";

  let darkColor = "#b58863";
  let lightColor = "#f0d9b5";
  let highlightColor = "#e06853";
  let moveColor = "#f7ec59";
  let ballColor = "#303030";

  async function loadData() {
    try {
      let response = await readTextFile("theme.txt", {
        dir: BaseDirectory.AppData,
      });
      const data = response.split("#");
      darkColor = "#" + data[1];
      lightColor = "#" + data[2];
      highlightColor = "#" + data[3];
      moveColor = "#" + data[4];
      ballColor = "#" + data[5];
    } catch {
      writeFile(
        {
          contents:
            darkColor + lightColor + highlightColor + moveColor + ballColor,
          path: "theme.txt",
        },
        { dir: BaseDirectory.AppData }
      );
    }
  }

  loadData();

  let initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR KQkq w";
  let start = false;

  document.addEventListener("keypress", (e) => {
    if (e.key == "Enter") go();
  });

  function go() {
    start = true;
    writeFile(
      {
        contents:
          darkColor + lightColor + highlightColor + moveColor + ballColor,
        path: "theme.txt",
      },
      { dir: BaseDirectory.AppData }
    );
  }
</script>

{#if start}
  <Main
    initialPos={initialPosition}
    {darkColor}
    {lightColor}
    {highlightColor}
    {moveColor}
    {ballColor}
  />
{:else}
  <main class="init">
    <input class="start" spellcheck="false" bind:value={initialPosition} />
    <button class="go" on:click={go}>Go</button>
    <section>
      Color Pallete
      <input
        class="colorpicker"
        style={`background-color: ${darkColor}`}
        spellcheck="false"
        bind:value={darkColor}
      />
      <input
        class="colorpicker"
        style={`background-color: ${lightColor}`}
        spellcheck="false"
        bind:value={lightColor}
      />
      <input
        class="colorpicker"
        style={`background-color: ${highlightColor}`}
        spellcheck="false"
        bind:value={highlightColor}
      />
      <input
        class="colorpicker"
        style={`background-color: ${moveColor}`}
        spellcheck="false"
        bind:value={moveColor}
      />
      <input
        class="colorpicker"
        style={`background-color: ${ballColor}`}
        spellcheck="false"
        bind:value={ballColor}
      />
    </section>
  </main>
{/if}

<style>
  .init {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  .init > * {
    padding: 1rem;
    text-align: center;
    border: 0px solid;
    border-radius: 1rem;
    color: #ffffff;
  }
  .start {
    width: 35rem;
    background-color: #202020;
  }
  .colorpicker {
    border-style: none;
    padding: 0.25rem;
    text-align: center;
  }
  section {
    display: flex;
    flex-direction: column;
    background-color: #202020;
  }
  .go {
    cursor: pointer;
    width: 25rem;
    background-color: #7fa650;
  }
  .start:focus {
    outline-style: none;
  }
  .colorpicker:focus {
    outline-style: none;
  }
</style>

<script>
  import Main from "./Main.svelte";
  import { BaseDirectory, writeFile, readTextFile } from "@tauri-apps/api/fs";

  let colors = {
    darkColor: "#b58863",
    lightColor: "#f0d9b5",
    highlightColor: "#e06853",
    moveColor: "#f7ec59",
    ballColor: "#303030",
  };

  function sum(thing) {
    let sum = "";
    for (const item in thing) sum += thing[item];
    return sum;
  }

  async function loadData() {
    try {
      let response = await readTextFile("theme.txt", {
        dir: BaseDirectory.AppData,
      });
      const data = response.split("#");
      let i = 1;
      for (const color in colors) {
        colors[color] = `#${data[i]}`;
        i++;
      }
    } catch {
      writeFile(
        {
          contents: sum(colors),
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
        contents: sum(colors),
        path: "theme.txt",
      },
      { dir: BaseDirectory.AppData }
    );
  }
</script>

{#if start}
  <Main initialPos={initialPosition} {...colors} />
{:else}
  <main class="init">
    <input class="start" spellcheck="false" bind:value={initialPosition} />
    <button class="go" on:click={go}>Go</button>
    <section>
      Color Pallete
      {#each Object.keys(colors) as color}
        <input
          class="colorpicker"
          style={`background-color: ${colors[color]}`}
          spellcheck="false"
          bind:value={colors[color]}
        />
      {/each}
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

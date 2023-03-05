<script>
  import Main from "./Main.svelte";

  let initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR KQkq w";
  let start = false;

  document.addEventListener("keypress", (e) => {
    if (e.key == "Enter") start = true;
    console.log(initialPosition);
  });
</script>

{#if start}
  <Main initialPos={initialPosition} />
{:else}
  <main class="init">
    <input class="start" spellcheck="false" bind:value={initialPosition} />
    <button class="go" on:click={() => (start = true)}>Go</button>
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
  .go {
    cursor: pointer;
    width: 25rem;
    background-color: #7fa650;
  }
  .start:focus {
    outline: none;
  }
</style>

<script type="ts">
  import { appWindow } from "@tauri-apps/api/window";
</script>

<div data-tauri-drag-region class="titlebar">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="titlebar-button"
    id="titlebar-minimize"
    on:click={() => appWindow.minimize()}
  >
    <img
      src="https://api.iconify.design/mdi:window-minimize.svg"
      alt="minimize"
    />
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="titlebar-button"
    id="titlebar-maximize"
    on:click={() => appWindow.toggleMaximize()}
  >
    <img
      src="https://api.iconify.design/mdi:window-maximize.svg"
      alt="maximize"
    />
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="titlebar-button"
    id="titlebar-close"
    on:click={() => appWindow.close()}
  >
    <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
  </div>
</div>

<style>
  .titlebar {
    background: #242424;
    user-select: none;
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem;
  }
  .titlebar-button:hover {
    background: #383838;
  }
  .titlebar-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
  }
</style>

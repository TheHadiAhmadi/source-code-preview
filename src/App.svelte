<script>
  import svelteLogo from './assets/svelte.svg'
import ButtonColors from './docs/ButtonColors.svelte'
import ButtonSizes from './docs/ButtonSizes.svelte';
  import Counter from './lib/Button.svelte'
import Preview from './lib/Preview.svelte'
</script>

<div class="container">

<h1>Buttons</h1>
Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum nostrum tempore dolore quos. Sequi adipisci voluptatem officia laudantium fugiat ratione, et, ad esse consequuntur dicta repudiandae voluptas, quibusdam mollitia rerum!

<h2>Sizes</h2>
Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam beatae ex nobis, veritatis ipsam quia voluptas totam dolores dicta deserunt vel adipisci delectus qui repellendus ratione nemo ad excepturi aut.
<Preview src="./docs/ButtonSizes.svelte">
  <ButtonSizes/>
</Preview>


<h2>Colors</h2>
Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam autem sapiente neque cupiditate quas ducimus mollitia quasi! Exercitationem, modi odit quidem tempore minus aliquam labore, voluptatibus provident eligendi odio ut!
<Preview src="./docs/ButtonColors.svelte">
  <ButtonColors/>
</Preview>
</div>

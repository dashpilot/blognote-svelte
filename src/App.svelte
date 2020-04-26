<script>
  import Posts from './components/Posts.svelte';
	import AddPost from './components/AddPost.svelte';
	import Categories from './components/Categories.svelte';
  import Firebase from './components/Firebase.svelte';

	let data = {};
	data.entries = [{
	    id: '3KvB5k89',
	    title: 'Welcome to BlogNote!',
	    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	    category: 'default'
	  }
	];

	data.categories = [{
	    name: 'default',
	    slug: 'default'
	  }
	];

	let current = data.entries[0].id;


</script>



<main>

<div class="row no-gutters">
<div class="col-md-2" id="side">

  <Categories bind:data={data} />


</div>

<div class="col-md-10">

  <nav class="nopad">
  <div class="row no-gutters"><div class="col-md-4" id="postnav-left"><div class="pad"><h6>Notes</h6><AddPost bind:data={data} bind:current={current}/></div></div><div class="col-md-8"><div class="pad" style="padding-right: 20px;"><Firebase bind:data={data} bind:current={current} /></div></div></div>

  </nav>
  <Posts bind:data={data} bind:current={current} />

</div>

</div>



<!--

<div class="row no-gutters">
<div class="col-md-2" id="side">

<Categories bind:data={data} />



</div>


<div class="col-md-10">

<nav>
<div class="row">
<div class="col-md-6">
<AddPost bind:data={data} bind:current={current} />
</div>
<div class="col-md-6 text-right">
<Firebase bind:data={data} bind:current={current} />
</div>
</div>
</nav>


<Posts bind:data={data} bind:current={current} />
</div>


</div>
-->

</main>



<style>

#side{
	background-color: #252A3A;
	color: white;
  border-right: 1px solid #DDD;
}


#postnav-left{
  border-right: 1px solid #DDD;
}

/*
#side{
  background-image: url(/assets/img/blognote-logo-inv.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
}
*/
</style>

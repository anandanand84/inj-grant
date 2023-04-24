<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { GrantObject } from "./grantsstore";
    import LabelValue from "components/LabelValue.svelte";
    import { Button } from "carbon-components-svelte";
    import { TrashCan } from "carbon-icons-svelte";

    let dispatch = createEventDispatcher();
    export let grant: GrantObject;

</script>
<div class="flex flex-row justify-between items-center flex-wrap">
    <LabelValue label="Address" value={`${grant.grantee}`} title={`${grant.grantee}`}></LabelValue>
    <LabelValue label="Type" value={`${grant.authorization.msg.split('/injective.exchange.v1beta1.')[1]}`} title={`${grant.authorization.msg.split('/injective.exchange.v1beta1.')[1]}`}></LabelValue>
    <LabelValue label="Expires" value={`${grant.expiration}`} title={`${grant.expiration}`}></LabelValue>
    <Button kind="danger" size="small" iconDescription="remove" on:click="{()=>{ dispatch('remove', grant)}}" icon={TrashCan} /> 
</div>

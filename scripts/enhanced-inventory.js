Hooks.once('init', async function() {
  console.log('D&D5e Enhanced Inventory | Initializing');

  // Register a client-side setting
  game.settings.register('dnd5e-enhanced-inventory', 'showInventoryStats', {
    name: 'Show Inventory Stats',
    hint: 'Toggle to show or hide "to hit" and "damage" values in the inventory view.',
    scope: 'client', // This makes it a client-side setting
    config: true, // This makes it appear in the settings menu
    type: Boolean,
    default: true // Default value
  });
});

Hooks.on('renderActorSheet5eCharacter', (app, html, data) => {
  const showStats = game.settings.get('dnd5e-enhanced-inventory', 'showInventoryStats');
  if (showStats) {
    enhanceInventory(app, html, data);
  }
});

function enhanceInventory(app, html, data) {
  const inventoryItems = html.find('.tab.inventory .item-list .item');
  
  inventoryItems.each((i, el) => {
    const item = data.actor.items.get(el.dataset.itemId);
    if (item.type === 'weapon' || item.type === 'equipment') {
      const toHit = calculateToHit(item, data.actor);
      const damage = calculateDamage(item);
      const newContent = `
        <div class="enhanced-inventory-data">
          <span class="to-hit">To Hit: ${toHit}</span>
          <span class="damage">Damage: ${damage}</span>
        </div>
      `;
      
      $(el).find('.item-name').after(newContent);
    }
  });
}

function calculateToHit(item, actor) {
  const abilityMod = actor.system.abilities[item.system.ability].mod;
  const profBonus = actor.system.attributes.prof;
  return abilityMod + profBonus;
}

function calculateDamage(item) {
  return item.system.damage ? item.system.damage.parts[0][0] : 'N/A';
}

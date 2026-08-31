import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEffects';

export const InventoryTracking = () => {
  const { activeBranch, addToast, inventoryItems, setInventoryItems } = useApp();
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [activePoItem, setActivePoItem] = useState(null);

  const [stockForm, setStockForm] = useState({
    itemId: 'INV-02',
    movementType: 'Stock In',
    quantity: 20,
    vendorNote: 'Monthly replenishment'
  });

  const handleAdjustStock = (itemId, delta) => {
    soundFx.playClick();
    setInventoryItems(
      inventoryItems.map((item) => {
        if (item.id === itemId) {
          const newStock = Math.max(0, item.stock + delta);
          return {
            ...item,
            stock: newStock,
            isLow: newStock <= item.threshold,
            lastRestocked: delta > 0 ? 'Today' : item.lastRestocked
          };
        }
        return item;
      })
    );
    addToast(`Updated stock level for ${itemId} (${delta > 0 ? '+' : ''}${delta})`, 'info');
  };

  const handleLogStock = (e) => {
    e.preventDefault();
    soundFx.playClick();
    const qty = Number(stockForm.quantity);
    setInventoryItems(
      inventoryItems.map((item) => {
        if (item.id === stockForm.itemId) {
          const newStock = stockForm.movementType === 'Stock In' ? item.stock + qty : Math.max(0, item.stock - qty);
          return { ...item, stock: newStock, isLow: newStock <= item.threshold, lastRestocked: 'Today' };
        }
        return item;
      })
    );
    setIsStockModalOpen(false);
    addToast(`Successfully logged ${stockForm.movementType} of ${stockForm.quantity} units.`, 'success', 'Inventory Logged');
  };

  const handleDispatchPo = () => {
    soundFx.playChime();
    addToast(`Purchase Order #PO-${Math.floor(8000 + Math.random() * 1000)} dispatched to ${activePoItem.vendor}. Delivery expected in 48h.`, 'success', 'PO Dispatched to Vendor');
    setInventoryItems(
      inventoryItems.map((item) =>
        item.id === activePoItem.id ? { ...item, poInTransit: true } : item
      )
    );
    setActivePoItem(null);
  };

  const lowStockCount = inventoryItems.filter((i) => i.isLow).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e0] dark:border-[#27272a] pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#7b5900] dark:text-[#f5b400] font-bold mb-1">
            Supplies & Facility Consumables • {activeBranch.city}
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#161616] dark:text-white">
            Consumables & Inventory Tracking
          </h1>
          <p className="text-xs text-[#747878] dark:text-[#a1a1aa] mt-1">
            Branch-specific pantry supplies, consumption telemetry, and automated low-stock PO reorders at {activeBranch.name}.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setIsStockModalOpen(true);
          }}
          className="px-4 py-2 bg-[#f5b400] text-[#161616] font-['Space_Grotesk'] font-bold text-xs hover:bg-[#ffdea4] rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">swap_vert</span>
          <span>Log Stock Movement (In / Out)</span>
        </button>
      </div>

      {/* Top 3 KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] p-5 rounded-3xl shadow-xs">
          <div className="text-[11px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa]">Total Tracked SKUs</div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#161616] dark:text-white mt-1">
            {inventoryItems.length} Consumable Items
          </div>
          <div className="text-[10px] text-[#1e8a5f] mt-1">✓ 100% Audit Coverage</div>
        </div>

        <div className="bg-white dark:bg-[#17181a] border border-[#f5b400] p-5 rounded-3xl shadow-xs bg-[#fffdf8] dark:bg-[#f5b400]/5">
          <div className="text-[11px] uppercase font-bold text-[#c77800] dark:text-[#f5b400]">Low Stock Alerts</div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#c77800] dark:text-[#f5b400] mt-1">
            {lowStockCount} Items Below Threshold
          </div>
          <div className="text-[10px] text-[#c77800] dark:text-[#f5b400] mt-1">
            {lowStockCount > 0 ? '⚡ Reorder recommended' : 'All stocks healthy'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] p-5 rounded-3xl shadow-xs">
          <div className="text-[11px] uppercase font-bold text-[#747878] dark:text-[#a1a1aa]">Monthly Consumption Value</div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#1e8a5f] mt-1">₹1,42,000</div>
          <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa] mt-1">8.4% under monthly allocation</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#e3e2e0] dark:border-[#27272a] bg-[#faf9f7] dark:bg-[#121315] flex items-center justify-between">
          <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#161616] dark:text-white">
            Live Consumables Stock Register
          </h3>
          <span className="text-xs text-[#747878] dark:text-[#a1a1aa]">Use inline steppers or Quick PO to restock</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#3a3a3a] bg-[#161616] text-white text-[10px] uppercase tracking-wider">
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Consumable Item</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Category</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Stock Level & Capacity</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk'] text-center">Safety Reorder</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk']">Vendor Partner</th>
                <th className="p-3.5 font-bold font-['Space_Grotesk'] text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e0] dark:divide-[#27272a]">
              {inventoryItems.map((inv) => {
                const maxScale = Math.max(inv.stock, inv.threshold * 2);
                const percent = Math.min(100, Math.round((inv.stock / maxScale) * 100));

                return (
                  <tr
                    key={inv.id}
                    className={`hover:bg-[#f8f7f5] dark:hover:bg-[#202024] transition-colors ${
                      inv.isLow ? 'bg-[#fffdf8] dark:bg-[#f5b400]/5' : ''
                    }`}
                  >
                    <td className="p-3.5 font-bold text-[#161616] dark:text-white">
                      <div>{inv.item}</div>
                      {inv.isLow && (
                        <span className="text-[10px] font-bold text-[#c77800] dark:text-[#f5b400] bg-[#fff4e5] dark:bg-[#f5b400]/20 px-2 py-0.5 rounded-md inline-block mt-1">
                          ⚠ Low Stock Warning
                        </span>
                      )}
                      {inv.poInTransit && (
                        <span className="text-[10px] font-bold text-[#1e8a5f] bg-[#e6f4ea] dark:bg-[#1e8a5f]/20 px-2 py-0.5 rounded-md inline-block mt-1 ml-1.5">
                          🚚 PO In-Transit
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-[#444748] dark:text-[#d4d4d8]">{inv.category}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-[#e3e2e0] dark:bg-[#27272a] h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${inv.isLow ? 'bg-[#c77800]' : 'bg-[#1e8a5f]'}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <span className="font-['Space_Grotesk'] font-bold text-[#161616] dark:text-white font-mono">
                          {inv.stock} {inv.unit}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-semibold text-[#747878] dark:text-[#a1a1aa] font-mono">
                      {inv.threshold} {inv.unit}
                    </td>
                    <td className="p-3.5 font-semibold text-[#161616] dark:text-white">
                      <div>{inv.vendor}</div>
                      <div className="text-[10px] text-[#747878] dark:text-[#a1a1aa] font-mono font-normal">
                        ₹{inv.unitCost}/{inv.unit}
                      </div>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Inline Stock Adjustment Steppers */}
                        <div className="flex items-center bg-[#f4f3f1] dark:bg-[#222326] rounded-xl p-0.5 border border-[#e3e2e0] dark:border-[#2e2f33]">
                          <button
                            onClick={() => handleAdjustStock(inv.id, -5)}
                            className="w-6 h-6 rounded-lg text-[#747878] hover:text-black dark:hover:text-white flex items-center justify-center font-bold"
                            title="Consume 5 units"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleAdjustStock(inv.id, 10)}
                            className="w-6 h-6 rounded-lg text-[#1e8a5f] hover:bg-white dark:hover:bg-[#161719] flex items-center justify-center font-bold"
                            title="Restock 10 units"
                          >
                            +10
                          </button>
                        </div>

                        {/* Quick Smart PO Trigger */}
                        {inv.isLow && (
                          <button
                            onClick={() => {
                              soundFx.playClick();
                              setActivePoItem(inv);
                            }}
                            className="px-2.5 py-1 bg-[#f5b400] text-[#161616] text-[10px] font-bold rounded-lg hover:bg-[#ffdea4] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">shopping_cart</span>
                            <span>Quick PO</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Purchase Order (PO) Modal */}
      {activePoItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-2xl space-y-4 text-[#161616] dark:text-white">
            <div className="flex justify-between items-center pb-3 border-b border-[#e3e2e0] dark:border-[#27272a]">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#f5b400] tracking-wider">
                  Automated Procurement
                </span>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold">
                  Purchase Order #{Math.floor(8000 + Math.random() * 1000)}
                </h3>
              </div>
              <button
                onClick={() => setActivePoItem(null)}
                className="p-1 text-[#747878] hover:text-black dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 bg-[#f8f7f5] dark:bg-[#1a1b1d] border border-[#e3e2e0] dark:border-[#27272a] rounded-2xl space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span>Vendor:</span>
                <strong>{activePoItem.vendor}</strong>
              </div>
              <div className="flex justify-between">
                <span>Item to Restock:</span>
                <strong>{activePoItem.item}</strong>
              </div>
              <div className="flex justify-between">
                <span>Recommended Quantity:</span>
                <strong>30 {activePoItem.unit} (Safety Buffer)</strong>
              </div>
              <div className="flex justify-between">
                <span>Base Cost:</span>
                <span className="font-mono">₹{30 * activePoItem.unitCost}</span>
              </div>
              <div className="flex justify-between">
                <span>18% GST:</span>
                <span className="font-mono">₹{Math.round(30 * activePoItem.unitCost * 0.18)}</span>
              </div>
              <div className="flex justify-between border-t border-[#e3e2e0] dark:border-[#27272a] pt-2 text-sm font-bold">
                <span>Total PO Value:</span>
                <span className="text-[#1e8a5f] font-mono">
                  ₹{Math.round(30 * activePoItem.unitCost * 1.18)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActivePoItem(null)}
                className="flex-1 py-2.5 bg-[#f4f3f1] dark:bg-[#202024] text-[#747878] dark:text-[#a1a1aa] font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDispatchPo}
                className="flex-1 py-2.5 bg-[#161616] text-[#f5b400] dark:bg-[#f5b400] dark:text-[#161616] font-bold text-xs rounded-xl shadow-md hover:scale-102 transition-all cursor-pointer"
              >
                Dispatch Purchase Order ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Stock In/Out Modal */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#17181a] border border-[#e3e2e0] dark:border-[#27272a] rounded-3xl p-6 shadow-2xl space-y-4 text-[#161616] dark:text-white">
            <div className="flex justify-between items-center pb-2 border-b border-[#e3e2e0] dark:border-[#27272a]">
              <h3 className="font-['Space_Grotesk'] text-base font-bold">
                Log Stock Inward / Consumption
              </h3>
              <button
                onClick={() => setIsStockModalOpen(false)}
                className="p-1 text-[#747878] hover:text-black dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleLogStock} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Select Item</label>
                <select
                  value={stockForm.itemId}
                  onChange={(e) => setStockForm({ ...stockForm, itemId: e.target.value })}
                  className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none"
                >
                  {inventoryItems.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.item} (Current: {i.stock} {i.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Movement Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Stock In', 'Stock Out (Consumed)'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setStockForm({ ...stockForm, movementType: type })}
                      className={`p-2 font-bold rounded-xl border ${
                        stockForm.movementType === type
                          ? 'border-[#f5b400] bg-[#f5b400] text-[#161616]'
                          : 'border-[#e3e2e0] dark:border-[#2e2f33]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                  className="w-full p-2.5 bg-[#f4f3f1] dark:bg-[#202024] border border-[#e3e2e0] dark:border-[#2e2f33] rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 bg-[#f4f3f1] dark:bg-[#202024] font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#f5b400] text-[#161616] font-bold rounded-xl"
                >
                  Save Stock Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

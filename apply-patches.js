const fs = require('fs');

const patches = [
  {
    file: 'd:/FROTA10K - SAAS/frontend/app/(dashboard)/tasks/page.tsx',
    replacements: [
      {
        old: '{members.map((member: any) => (\n                           <button key={member.id} className="text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm truncate">\n                              {member.name}\n                           </button>\n                        ))}',
        new: '{members?.map((member: any) => (\n                           <button key={member?.id} className="text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm truncate">\n                              {member?.name || "Membro"}\n                           </button>\n                        ))}'
      }
    ]
  },
  {
    file: 'd:/FROTA10K - SAAS/frontend/app/(dashboard)/marketplace/page.tsx',
    replacements: [
      {
        old: '{pub.account.name}',
        new: '{pub.account?.name || "Empresa"}'
      },
      {
        old: '{pub.id.slice(-6).toUpperCase()}',
        new: '{pub.id?.slice(-6).toUpperCase() || "ID"}'
      },
      {
        old: '{pub.title}',
        new: '{pub.title || "Oferta"}'
      },
      {
        old: '{pub.asset.year} / {pub.asset.color}',
        new: '{pub.asset?.year || "---"} / {pub.asset?.color || "N/A"}'
      },
      {
         old: 'pub.asset.type === "CAR"',
         new: 'pub.asset?.type === "CAR"'
      },
      {
         old: "pub.asset.type === 'CAR' ? 'Carro' : 'Moto'",
         new: "pub.asset?.type === 'CAR' ? 'Carro' : 'Moto'"
      }
    ]
  }
];

patches.forEach(p => {
  try {
    let content = fs.readFileSync(p.file, 'utf8');
    p.replacements.forEach(r => {
      content = content.split(r.old).join(r.new);
    });
    fs.writeFileSync(p.file, content);
    console.log(`Patch aplicado com sucesso em ${p.file}`);
  } catch (e) {
    console.error(`Erro ao aplicar patch em ${p.file}:`, e.message);
  }
});

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
 
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check if any account already exists
    const accountCount = await db.account.count();
    
    if (accountCount > 0) {
      return NextResponse.json(
        { error: "O sistema já possui contas configuradas." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create First Account and Admin User
    const account = await db.account.create({
      data: {
        name: "FROTA10K Matriz",
        public_name: "Frota10K Sistema",
        users: {
          create: {
            name: "Administrador",
            email: "admin@frota10k.com.br",
            password: hashedPassword,
            role: "account_admin",
            status: "ACTIVE",
          },
        },
      },
      include: {
        users: true,
      }
    });

    const adminUser = account.users[0];

    // Create Sample Leads
    await db.lead.createMany({
      data: [
        { account_id: account.id, name: "João Silva", phone: "(11) 98888-7777", source: "Marketplace", status: "NEW" },
        { account_id: account.id, name: "Maria Oliveira", phone: "(11) 97777-6666", source: "Facebook", status: "NEW" },
        { account_id: account.id, name: "Pedro Santos", phone: "(11) 96666-5555", source: "Indicação", status: "NEW" },
      ]
    });

    // Create Sample Assets
    await db.asset.createMany({
      data: [
        { 
          account_id: account.id, 
          type: "CAR", 
          brand: "Toyota", 
          model: "Corolla", 
          year: 2022, 
          plate: "ABC-1234", 
          km: 15000, 
          estimated_value: 120000, 
          status: "SCREENING" 
        },
        { 
          account_id: account.id, 
          type: "CAR", 
          brand: "Honda", 
          model: "Civic", 
          year: 2021, 
          plate: "XYZ-5678", 
          km: 25000, 
          estimated_value: 110000, 
          status: "SCREENING" 
        },
        { 
          account_id: account.id, 
          type: "CAR", 
          brand: "Volkswagen", 
          model: "Golf", 
          year: 2023, 
          plate: "DEF-9012", 
          km: 5000, 
          estimated_value: 150000, 
          status: "COMMITTEE" 
        },
      ]
    });

    return NextResponse.json({
      message: "Ambiente de teste configurado com sucesso!",
      account: account.name,
      admin_user: adminUser.email,
      password_provisoria: "admin123",
      aviso: "Cuidado: Esta rota deve ser removida em produção.",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao configurar conta inicial.", details: error.message },
      { status: 500 }
    );
  }
}

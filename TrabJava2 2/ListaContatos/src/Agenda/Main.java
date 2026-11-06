package agenda;

import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Agenda agenda = new Agenda();
        Scanner sc = new Scanner(System.in);

        while (true) {
            printMenu();
            System.out.print("Escolha uma opção: ");
            String opc = sc.nextLine().trim();
            switch (opc) {
                case "1":
                    System.out.print("Caminho do arquivo para importar (ex: C:\\temp\\contatos.txt ou ./contatos.txt): ");
                    String caminhoImp = sc.nextLine().trim();
                    agenda.importarContatos(caminhoImp);
                    break;
                case "2":
                    System.out.print("Caminho do arquivo para exportar: ");
                    String caminhoExp = sc.nextLine().trim();
                    agenda.exportarContatos(caminhoExp);
                    break;
                case "3":
                    System.out.print("Nome (<=30 caracteres): ");
                    String nome = sc.nextLine().trim();
                    System.out.print("Telefone (11 dígitos): ");
                    String tel = sc.nextLine().trim();
                    System.out.print("Endereço (<=100 caracteres): ");
                    String end = sc.nextLine().trim();
                    agenda.inserirContato(new Contato(nome, tel, end));
                    break;
                case "4":
                    System.out.print("Telefone a remover (11 dígitos): ");
                    String remTel = sc.nextLine().trim();
                    agenda.removerPorTelefone(remTel);
                    break;
                case "5":
                    System.out.print("Nome a remover: ");
                    String remNome = sc.nextLine().trim();
                    agenda.removerPorNome(remNome);
                    break;
                case "6":
                    System.out.print("Nome a localizar: ");
                    String buscaNome = sc.nextLine().trim();
                    List<Contato> encontrados = agenda.localizarPorNome(buscaNome);
                    if (encontrados.isEmpty()) System.out.println("Nenhum contato encontrado com nome que contenha: " + buscaNome);
                    else encontrados.forEach(System.out::println);
                    break;
                case "7":
                    System.out.print("Telefone a localizar: ");
                    String buscaTel = sc.nextLine().trim();
                    Contato c = agenda.localizarPorTelefone(buscaTel);
                    if (c == null) System.out.println("Contato não encontrado.");
                    else System.out.println(c);
                    break;
                case "8":
                    agenda.listarTodos();
                    break;
                case "9":
                    System.out.print("Telefone para realizar chamada: ");
                    String chTel = sc.nextLine().trim();
                    agenda.realizarChamada(chTel);
                    break;
                case "10":
                    System.out.print("Tem certeza que deseja limpar toda a agenda? (s/n): ");
                    String conf = sc.nextLine().trim().toLowerCase();
                    if (conf.equals("s") || conf.equals("sim")) agenda.limparAgenda();
                    else System.out.println("Operação cancelada.");
                    break;
                case "11":
                    System.out.println("Saindo...");
                    sc.close();
                    return;
                default:
                    System.out.println("Opção inválida. Digite um número entre 1 e 11.");
            }
            System.out.println();
        }
    }

    private static void printMenu() {
        System.out.println("===== AGENDA DE CONTATOS =====");
        System.out.println("1 - Importar Contatos");
        System.out.println("2 - Exportar Contatos");
        System.out.println("3 - Inserir Contato");
        System.out.println("4 - Remover Contato (Telefone)");
        System.out.println("5 - Remover Contato (Nome)");
        System.out.println("6 - Localizar Contato (Nome)");
        System.out.println("7 - Localizar Contato (Telefone)");
        System.out.println("8 - Listar Todos os Contatos");
        System.out.println("9 - Realizar Chamada");
        System.out.println("10 - Limpar Agenda");
        System.out.println("11 - Sair");
    }
}

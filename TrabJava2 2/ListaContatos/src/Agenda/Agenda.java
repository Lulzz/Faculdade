package agenda;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

public class Agenda {
    private final Map<String, Contato> contatos = new HashMap<>();

    public boolean inserirContato(Contato contato) {
        if (contato == null) {
            System.out.println("Contato nulo.");
            return false;
        }
        String nome = contato.getNome();
        String telefone = contato.getTelefone();
        String endereco = contato.getEndereco();

        if (nome.isBlank()) {
            System.out.println("Nome vazio — contato não foi inserido.");
            return false;
        }
        if (!telefone.matches("\\d{11}")) {
            System.out.println("Telefone inválido — deve conter exatamente 11 dígitos. Contato não foi inserido.");
            return false;
        }

        boolean changed = false;
        if (nome.length() > 30) { nome = nome.substring(0, 30); changed = true; }
        if (endereco.length() > 100) { endereco = endereco.substring(0, 100); changed = true; }
        Contato toStore = changed ? new Contato(nome, telefone, endereco) : contato;

        if (contatos.containsKey(telefone)) {
            System.out.println("Atenção: telefone já existe — substituindo o contato antigo.");
        }
        contatos.put(telefone, toStore);
        return true;
    }

    public boolean removerPorTelefone(String telefone) {
        if (contatos.remove(telefone) != null) {
            System.out.println("Contato com telefone " + telefone + " removido.");
            return true;
        } else {
            System.out.println("Contato com telefone " + telefone + " não encontrado.");
            return false;
        }
    }

    public int removerPorNome(String nome) {
        List<String> chavesRemover = new ArrayList<>();
        for (Map.Entry<String, Contato> e : contatos.entrySet()) {
            if (e.getValue().getNome().equalsIgnoreCase(nome.trim())) chavesRemover.add(e.getKey());
        }
        for (String k : chavesRemover) contatos.remove(k);
        System.out.println(chavesRemover.size() + " contato(s) removido(s) com o nome '" + nome + "'.");
        return chavesRemover.size();
    }

    public List<Contato> localizarPorNome(String nome) {
        List<Contato> encontrados = new ArrayList<>();
        String alvo = nome.trim().toLowerCase();
        for (Contato c : contatos.values()) {
            if (c.getNome().toLowerCase().contains(alvo)) encontrados.add(c);
        }
        return encontrados;
    }

    public Contato localizarPorTelefone(String telefone) {
        return contatos.get(telefone);
    }

    public void listarTodos() {
        if (contatos.isEmpty()) {
            System.out.println("Agenda vazia.");
            return;
        }
        List<Contato> lista = new ArrayList<>(contatos.values());
        lista.sort(Comparator.comparing(Contato::getNome, String.CASE_INSENSITIVE_ORDER));
        for (Contato c : lista) System.out.println(c);
    }

    public void realizarChamada(String telefone) {
        Contato c = localizarPorTelefone(telefone);
        if (c == null) {
            System.out.println("Contato não encontrado para o telefone " + telefone);
        } else {
            System.out.println("Ligando para " + c.getNome() + " (" + c.getTelefone() + ") ...");
        }
    }

    public void limparAgenda() {
        contatos.clear();
        System.out.println("Agenda limpa.");
    }

    public void importarContatos(String caminhoArquivo) {
        Path p = Paths.get(caminhoArquivo);
        if (!Files.exists(p)) {
            System.out.println("Arquivo não encontrado: " + caminhoArquivo);
            return;
        }
        int linhaNum = 0;
        int importados = 0;
        try (BufferedReader br = Files.newBufferedReader(p)) {
            String linha;
            while ((linha = br.readLine()) != null) {
                linhaNum++;
                if (linha.trim().isEmpty()) continue;
                String[] parts = linha.split("@", -1);
                if (parts.length != 3) {
                    System.out.println("Linha " + linhaNum + " inválida (esperado 3 campos separados por '@'). Conteúdo: " + linha);
                    continue;
                }
                String nome = parts[0].trim();
                String telefone = parts[1].trim();
                String endereco = parts[2].trim();

                if (!telefone.matches("\\d{11}")) {
                    System.out.println("Linha " + linhaNum + " ignorada: telefone deve ter exatamente 11 dígitos. Encontrado: '" + telefone + "'");
                    continue;
                }
                if (nome.length() > 30) {
                    System.out.println("Linha " + linhaNum + ": nome maior que 30 caracteres. Será truncado.");
                    nome = nome.substring(0, 30);
                }
                if (endereco.length() > 100) {
                    System.out.println("Linha " + linhaNum + ": endereço maior que 100 caracteres. Será truncado.");
                    endereco = endereco.substring(0, 100);
                }
                inserirContato(new Contato(nome, telefone, endereco));
                importados++;
            }
            System.out.println("Importação finalizada. " + importados + " contato(s) importado(s).");
        } catch (IOException e) {
            System.out.println("Erro ao ler o arquivo: " + e.getMessage());
        }
    }

    public void exportarContatos(String caminhoArquivo) {
        Path p = Paths.get(caminhoArquivo);
        try (BufferedWriter bw = Files.newBufferedWriter(p)) {
            for (Contato c : contatos.values()) {
                bw.write(c.getNome() + "@" + c.getTelefone() + "@" + c.getEndereco());
                bw.newLine();
            }
            System.out.println("Exportação concluída: " + caminhoArquivo);
        } catch (IOException e) {
            System.out.println("Erro ao escrever arquivo: " + e.getMessage());
        }
    }
}

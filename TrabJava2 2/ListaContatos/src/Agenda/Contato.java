package agenda;

public class Contato {
    private final String nome;
    private final String telefone;
    private final String endereco;

    public Contato(String nome, String telefone, String endereco) {
        this.nome = nome == null ? "" : nome.trim();
        this.telefone = telefone == null ? "" : telefone.trim();
        this.endereco = endereco == null ? "" : endereco.trim();
    }

    public String getNome() {
        return nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getEndereco() {
        return endereco;
    }

    @Override
    public String toString() {
        return String.format("Nome: %s | Telefone: %s | Endereço: %s", nome, telefone, endereco);
    }
}
